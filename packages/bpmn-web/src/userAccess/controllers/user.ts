import crypto from 'node:crypto';
import { promisify } from 'node:util';
import lodash from 'lodash';
import mailChecker from 'mailchecker';
import passport from 'passport';
import validator from 'validator';
import User from '../models/User.js';
import * as Mailer from '../config/mail.js';
import { home, signupGroups, signupVerifiesEmail } from '../roles.js';
import { firstRunPending, isSetupToken, endFirstRun } from '../firstRun.js';
import { Tokens } from '../../routes/api/tokens.js';
import { UserService, userNameProblem } from '../UserService.js';
import { answerMessage } from '../../routes/common.js';

const _ = lodash;
const randomBytesAsync = promisify(crypto.randomBytes);

/** The address links in emails use: SITE_URL, else the request's. */
const siteUrl = (req) => (process.env.SITE_URL || `${req.protocol}://${req.headers.host}`).replace(/\/$/, '');

/** A new verification token for the user, and the email with its link. */
async function sendVerification(req, user) {
    const token = (await randomBytesAsync(16)).toString('hex');
    await User.updateOne({ _id: user._id }, { emailVerificationToken: token });
    const site = process.env.SITE_NAME || 'bpmn-server';
    return Mailer.sendMail({
        to: user.email,
        from: process.env.EMAIL_FROM,
        subject: `Please verify your email address on ${site}`,
        text: `Thank you for signing up to ${site}.\n\nTo verify your email address, click on the following link, or paste it into your browser:\n\n${siteUrl(req)}/account/verify/${token}\n\nThank you!`,
    });
}

const viewPath = '../userAccess/views/account/';
export class UserController {
    static admin(req, res) {
        if (!req.user || !req.user.isAdmin) {
            return res.redirect('/');
        }

        User
            .find()
            .then((users) => {
                if (!users) {
                    console.log('no such user');
                }
                else {
                    res.render(viewPath+'admin', { title: 'Admin', users });
                }
            })
            .catch((error) => {
                console.log('Error saving the user profile to the database after email verification', error);
            });
    }
    /**
     * GET /account/edit
     * Edit user Page.
     */
    static getEdit(req, res) {
        if (!req.isAdmin) {
            return res.redirect('/');
        }
        console.log('req.params',req.params)
        User
            .findById(req.params.id)
            .then((editUser) => {
                if (!editUser) {
                    console.log('no such user');
                    req.flash('errors', 'no such user');
                    return res.redirect('/admin');
                }
                else {
                    console.log('editUser', editUser);
                    res.render(viewPath+'profile', { title: 'profile', editUser, editGroups: true });
                }
            })
            .catch((error) => {
                console.log('Error saving the user profile to the database after email verification', error);
            });
    }
    /**
     * POST /account/edit
     * Update profile information by admin
     */
    static postEdit(req, res, next) {
        // the user being edited (the form's id), not the administrator signed in
        const editPage = '/account/edit/' + encodeURIComponent(String(req.body.id || ''));
        const validationErrors = [];
        if (!validator.isEmail(req.body.email))
            validationErrors.push({ msg: 'Please enter a valid email address.' });
        if (validationErrors.length) {
            req.flash('errors', validationErrors);
            return res.redirect(editPage);
        }
        req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

        return User.findById(req.body.id).then(user => {
            if (!user) {
                req.flash('errors', { msg: 'No such user.' });
                return res.redirect('/admin');
            }
            if (user.email !== req.body.email)
                user.emailVerified = false;
            user.email = req.body.email || '';
            user.userGroups = String(req.body.userGroups || '').split(',').map(group => group.trim()).filter(Boolean);
            user.profile.name = req.body.name || '';
            user.profile.gender = req.body.gender || '';
            user.profile.location = req.body.location || '';
            user.profile.website = req.body.website || '';
            return user.save().then(() => {
                req.flash('success', { msg: 'Profile information has been updated.' });
                res.redirect(editPage);
            });
        }).catch(err => {
            if (err?.code === 11000) {
                req.flash('errors', { msg: 'The email address you have entered is already associated with an account.' });
                return res.redirect(editPage);
            }
            next(err);
        });
    }
    /**
     * GET /login
     * Login page.
     */
    /** The first start: the administrator, with the token the server printed; then, if asked, the tutorials' users. */
    static getSetup(req, res) {
        if (!firstRunPending(req.app)) return res.redirect('/login');
        res.render(viewPath + 'setup', { title: 'Set up this server', token: req.query.token ?? '', values: {}, message: null, canSignup: false });
    }

    static async postSetup(req, res) {
        if (!firstRunPending(req.app)) return answerMessage(req, res, 404, 'This server is set up already: sign in.');
        const { token, userName = '', email = '', password = '', confirmPassword = '', sampleUsers, samplePassword = '' } = req.body ?? {};
        const again = (status, message) => res.status(status).render(viewPath + 'setup', {
            title: 'Set up this server', token: '', values: { userName, email, sampleUsers }, message, canSignup: false });
        if (!isSetupToken(token, req.app)) return again(403, 'That is not the setup token the server printed when it started.');
        const nameProblem = userNameProblem(String(userName).trim());
        if (nameProblem) return again(400, nameProblem);
        if (!validator.isEmail(String(email))) return again(400, 'Give the administrator\'s email.');
        if (String(password).length < 8) return again(400, 'The password needs at least 8 characters.');
        if (password !== confirmPassword) return again(400, 'The two passwords differ.');
        if (sampleUsers === 'true' && String(samplePassword).length < 4) return again(400, 'Give the sample users a password, or leave them out.');
        const users = new UserService();
        const admin = await users.addUser(String(userName).trim(), String(email), password, ['ADMIN']);
        if (sampleUsers === 'true') {
            await users.addUser('user1', 'user1@example.com', samplePassword, ['Employee']);
            await users.addUser('manager1', 'manager1@example.com', samplePassword, ['Employee', 'Manager']);
        }
        endFirstRun(req.app);
        req.logIn(admin, error => error ? answerMessage(req, res, 500, 'The administrator was created: sign in.') : res.redirect('/'));
    }

    static getLogin(req, res) {
        if (req.user) {
            return res.redirect('/');
        }
        res.render(viewPath + 'login', {
            title: 'Login'
        });
    }
    /**
     * POST /login
     * Sign in using email and password.
     */
    static postLogin(req, res, next) {
        const validationErrors = [];
        if (validator.isEmpty(req.body.userName))
            validationErrors.push({ msg: 'Password cannot be blank.' });
        if (validationErrors.length) {
            req.flash('errors', validationErrors);
            return res.redirect('/login');
        }
        //req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                console.log('authenticate Info', info);
                req.flash('errors', info);
                return res.redirect('/login');
            }
            // the page it was on its way to, read now: logging in starts a new session, without it
            const back = req.session.returnTo;
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                req.flash('success', { msg: 'Success! You are logged in.' });
                // the site itself (/) is the user's home
                res.redirect(back && back !== '/' ? back : home(user));
            });
        })(req, res, next);
    }
    /**
     * GET /logout
     * Log out.
     */
    static logout(req, res, next) {
        // their tokens go with them: their AI links and the pages' (routes/api/pageClient.ts)
        const server = req.app?.get('bpmnServer');
        if (server && req.user?.userName) new Tokens(server).revoke(req.user.userName).catch(() => { /* they expire by themselves */ });
        req.session.destroy((err) => {
            if (err)
                console.log('Error : Failed to destroy the session during logout.', err);
            req.user = null;
            // answered: not next(), which went on to the next route and answered again (ERR_HTTP_HEADERS_SENT)
            res.redirect('/');
        });
        /*
        req.logout(function (err) {
            if (err) { return next(err); }
            res.redirect('/');
        }); */
    }
    /**
     * GET /signup
     * Signup page.
     */
    static getSignup(req, res) {
        if (req.user) {
            return res.redirect('/');
        }
        res.render(viewPath + 'signup', {
            title: 'Create Account'
        });
    }
    /**
     * POST /signup
     * Create a new local account.
     */
    static postSignup(req, res, next) {
        console.log('postSignup');
        const validationErrors = [];
        req.body.userName = String(req.body.userName ?? '').trim();
        const nameProblem = userNameProblem(req.body.userName);
        if (nameProblem)
            validationErrors.push({ msg: nameProblem });
        if (!validator.isEmail(req.body.email))
            validationErrors.push({ msg: 'Please enter a valid email address.' });
        else if (signupVerifiesEmail() && !mailChecker.isValid(req.body.email))
            validationErrors.push({ msg: 'That email address can not be verified: please use another.' });
        if (!validator.isLength(req.body.password, { min: 8 }))
            validationErrors.push({ msg: 'Password must be at least 8 characters long' });
        if (req.body.password !== req.body.confirmPassword)
            validationErrors.push({ msg: 'Passwords do not match' });
        if (validationErrors.length) {
            req.flash('errors', validationErrors);
            return res.redirect('/signup');
        }
        req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });
        const verifies = signupVerifiesEmail();
        const user = new User({
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password,
            // verifying gives them (getVerifyEmailToken)
            userGroups: verifies ? [] : signupGroups(),
        });
        const taken = async () => {
            if (await new UserService().userNamed(req.body.userName))
                return 'Account with that userName already exists.';
            if (await User.findOne({ email: req.body.email }))
                return 'Account with that email address already exists.';
        };
        taken().then(async (message) => {
            if (message) {
                req.flash('errors', { msg: message });
                return res.redirect('/signup');
            }
            await user.save();
            req.logIn(user, async (err) => {
                if (err)
                    return next(err);
                if (!verifies)
                    return res.redirect('/');
                // where the visitor was: an editor, back at its unsaved model
                if (/^\/model\/(add|edit)\/[^/]+$/.test(String(req.query.next)))
                    req.session.afterVerify = String(req.query.next);
                try {
                    await sendVerification(req, user);
                    req.flash('info', { msg: `Almost there: we sent an email to ${user.email}. Open its link to start saving.` });
                }
                catch (error) {
                    console.error('Could not send the verification email:', error.message);
                    req.flash('errors', { msg: 'Your account is made, but the verification email could not be sent. Try again from this page.' });
                }
                res.redirect('/account');
            });
        }).catch(next);
    }
    /**
     * GET /account
     * Profile page.
     */
    static getAccount(req, res) {
        res.render(viewPath + 'profile', {
            editUser: req.user, editGroups: false,
            title: 'Account Management'
        });
    }
    /**
     * POST /account/profile
     * Update profile information.
     */
    static postUpdateProfile(req, res, next) {
        const validationErrors = [];
        if (!validator.isEmail(req.body.email))
            validationErrors.push({ msg: 'Please enter a valid email address.' });
        if (validationErrors.length) {
            req.flash('errors', validationErrors);
            return res.redirect('/account');
        }
        req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });


        return User.findById(req.user.id).then((user) =>
            {
            if (!user) return res.status(404).send('User not found');
            if (user.email !== req.body.email)
                user.emailVerified = false;
            user.email = req.body.email || '';
            user.profile.name = req.body.name || '';
            user.profile.gender = req.body.gender || '';
            user.profile.location = req.body.location || '';
            user.profile.website = req.body.website || '';
           
            return user.save().then((savedUser) => {
                if (user!==savedUser) {
                        req.flash('errors', { msg: 'The email address you have entered is already associated with an account.' });
                        return res.redirect('/account');
                } 
                req.flash('success', { msg: 'Profile information has been updated.' });
                res.redirect('/account');
            });
        });
    }
    /**
     * POST /account/password
     * Update current password.
     */
    static postUpdatePassword(req, res, next) {
        const validationErrors = [];
        if (!validator.isLength(req.body.password, { min: 8 }))
            validationErrors.push({ msg: 'Password must be at least 8 characters long' });
        if (req.body.password !== req.body.confirmPassword)
            validationErrors.push({ msg: 'Passwords do not match' });
        if (validationErrors.length) {
            req.flash('errors', validationErrors);
            return res.redirect('/account');
        }

        return User.findById(req.user.id).then(( user) => {
            if (!user) return res.status(404).send('User not found');
            user.password = req.body.password;
            return user.save().then((savedUser) => {
                if (user !== savedUser) {
                    req.flash('error', { msg: 'Password has not been changed for user ' + user.userName + '.' });
                }
                req.flash('success', { msg: 'Password has been changed for user '+user.userName+'.' });
                res.redirect('/account');
            });
        });
    }
    /**
     * POST /account/delete
     * Delete user account.
     */
    static async postDeleteAccount(req, res, next) {

        await User.deleteOne({ _id: req.user.id });
        req.logout(err => {
            if (err) return next(err);
            req.flash('info', { msg: 'Your account has been deleted.' });
            res.redirect('/');
        });
    }
    /**
     * GET /account/unlink/:provider
     * Unlink OAuth provider.
     */
    static getOauthUnlink(req, res, next) {
        const { provider } = req.params;


        User.findById(req.user.id).then((user) => {
            user[provider.toLowerCase()] = undefined;
            const tokensWithoutProviderToUnlink = user.tokens.filter((token) => token.kind !== provider.toLowerCase());
            // Some auth providers do not provide an email address in the user profile.
            // As a result, we need to verify that unlinking the provider is safe by ensuring
            // that another login method exists.
            if (!(user.email && user.password)
                && tokensWithoutProviderToUnlink.length === 0) {
                req.flash('errors', {
                    msg: `The ${_.startCase(_.toLower(provider))} account cannot be unlinked without another form of login enabled.`
                        + ' Please link another account or add an email address and password.'
                });
                return res.redirect('/account');
            }
            user.tokens = tokensWithoutProviderToUnlink;
            user.save().then((savedUser) => {
                req.flash('info', { msg: `${_.startCase(_.toLower(provider))} account has been unlinked.` });
                res.redirect('/account');
            });
        });
    }
    /**
     * GET /reset/:token
     * Reset Password page.
     */
    static getReset(req, res, next) {
        if (req.isAuthenticated()) {
            return res.redirect('/');
        }
        const validationErrors = [];
        if (!validator.isHexadecimal(req.params.token))
            validationErrors.push({ msg: 'Invalid Token.  Please retry.' });
        if (validationErrors.length) {
            req.flash('errors', validationErrors);
            return res.redirect('/forgot');
        }
        User
            .findOne({ passwordResetToken: req.params.token })
            .where('passwordResetExpires').gt(Date.now())
            .exec()
            .then((user) => {
                if (!user) {
                    req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
                    return res.redirect('/forgot');
                }
                res.render(viewPath + 'reset', {
                    title: 'Password Reset'
                });
            })
            .catch((err) => next(err));
    }
    /**
     * GET /account/verify/:token
     * Verify email address
     */
    static getVerifyEmailToken(req, res, next) {
        if (req.user.emailVerified) {
            req.flash('info', { msg: 'The email address has been verified.' });
            return res.redirect('/account');
        }
        const validationErrors = [];
        if (req.params.token && (!validator.isHexadecimal(req.params.token)))
            validationErrors.push({ msg: 'Invalid Token.  Please retry.' });
        if (validationErrors.length) {
            req.flash('errors', validationErrors);
            return res.redirect('/account');
        }
        if (req.params.token === req.user.emailVerificationToken) {
            User
                .findOne({ email: req.user.email })
                .then((user) => {
                    if (!user) {
                        req.flash('errors', { msg: 'There was an error in loading your profile.' });
                        return res.redirect(req.get('Referrer') || '/');
                    }
                    user.emailVerificationToken = '';
                    user.emailVerified = true;
                    if (signupVerifiesEmail())
                        user.userGroups = [...new Set([...(user.userGroups ?? []), ...signupGroups()])];
                    return user.save().then(() => {
                        req.flash('info', { msg: 'Thank you for verifying your email address.' });
                        const back = req.session.afterVerify;
                        delete req.session.afterVerify;
                        return res.redirect(back ?? '/account');
                    });
                })
                .catch((error) => {
                    console.log('Error saving the user profile to the database after email verification', error);
                    req.flash('errors', { msg: 'There was an error when updating your profile.  Please try again later.' });
                    return res.redirect('/account');
                });
        }
        else {
            req.flash('errors', { msg: 'The verification link was invalid, or is for a different account.' });
            return res.redirect('/account');
        }
    }
    /**
     * GET /account/verify
     * Verify email address
     */
    static getVerifyEmail(req, res, next) {
        if (req.user.emailVerified) {
            req.flash('info', { msg: 'The email address has been verified.' });
            return res.redirect('/account');
        }
        if (!mailChecker.isValid(req.user.email)) {
            req.flash('errors', { msg: 'The email address is invalid or disposable and can not be verified.  Please update your email address and try again.' });
            return res.redirect('/account');
        }
        sendVerification(req, req.user)
            .then(() => {
                req.flash('info', { msg: `An e-mail has been sent to ${req.user.email} with further instructions.` });
                res.redirect('/account');
            })
            .catch((error) => {
                // the usual reason: this server has no mail settings (SMTP_USER, SMTP_PASSWORD)
                console.error('Could not send the verification email:', error.message);
                req.flash('errors', { msg: 'Could not send the verification email: is mail set up on this server?' });
                res.redirect('/account');
            });
    }
    /**
     * POST /reset/:token
     * Process the reset password request.
     */
    static postReset(req, res, next) {
        const validationErrors = [];
        if (!validator.isLength(req.body.password, { min: 8 }))
            validationErrors.push({ msg: 'Password must be at least 8 characters long' });
        if (req.body.password !== req.body.confirm)
            validationErrors.push({ msg: 'Passwords do not match' });
        if (!validator.isHexadecimal(req.params.token))
            validationErrors.push({ msg: 'Invalid Token.  Please retry.' });
        if (validationErrors.length) {
            req.flash('errors', validationErrors);
            return res.redirect(req.get('Referrer') || '/');
        }
        const resetPassword = () => User
            .findOne({ passwordResetToken: req.params.token })
            .where('passwordResetExpires').gt(Date.now())
            .then((user) => {
                if (!user) {
                    req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
                    return res.redirect(req.get('Referrer') || '/');
                }
                user.password = req.body.password;
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;
                return user.save().then(() => new Promise((resolve, reject) => {
                    req.logIn(user, (err) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve(user);
                    });
                }));
            });
        const sendResetPasswordEmail = (user) => {
            if (!user) {
                return;
            }
            const mailOptions = {
                to: user.email,
                from: process.env.EMAIL_FROM,
                subject: `Your ${process.env.SITE_NAME} password has been changed`,
                text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
            };
            const mailSettings = {
                successfulType: 'success',
                successfulMsg: 'Success! Your password has been changed.',
                loggingError: 'ERROR: Could not send password reset confirmation email after security downgrade.\n',
                errorType: 'warning',
                errorMsg: 'Your password has been changed, however we were unable to send you a confirmation email. We will be looking into it shortly.',
                mailOptions,
                req
            };
            return Mailer.sendMail(mailOptions);
        };
        resetPassword()
            .then(sendResetPasswordEmail)
            .then(() => {
                if (!res.finished)
                    res.redirect('/');
            })
            .catch((err) => next(err));
    }
    /**
     * GET /forgot
     * Forgot Password page.
     */
    static getForgot(req, res) {
        if (req.isAuthenticated()) {
            return res.redirect('/');
        }
        res.render(viewPath + 'forgot', {
            title: 'Forgot Password'
        });
    }
    /**
     * POST /forgot
     * Create a random token, then the send user an email with a reset link.
     */
    static postForgot(req, res, next) {
        const validationErrors = [];
        if (!validator.isEmail(req.body.email))
            validationErrors.push({ msg: 'Please enter a valid email address.' });
        if (validationErrors.length) {
            req.flash('errors', validationErrors);
            return res.redirect('/forgot');
        }
        req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });
        const createRandomToken = randomBytesAsync(16)
            .then((buf) => buf.toString('hex'));
        const setRandomToken = (token) => User
            .findOne({ email: req.body.email })
            .then((user) => {
                if (!user) {
                    req.flash('errors', { msg: 'Account with that email address does not exist.' });
                }
                else {
                    user.passwordResetToken = token;
                    user.passwordResetExpires = new Date(Date.now() + 3600000) as any; // 1 hour
                    void user.save();
                }
                return user;
            });
        const sendForgotPasswordEmail = (user) => {
            if (!user) {
                return;
            }
            const token = user.passwordResetToken;
            const mailOptions = {
                to: user.email,
                from: process.env.EMAIL_FROM,
                subject: `Reset your password on ${process.env.SITE_NAME}`,
                text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${siteUrl(req)}/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
            };
            const mailSettings = {
                successfulType: 'info',
                successfulMsg: `An e-mail has been sent to ${user.email} with further instructions.`,
                loggingError: 'ERROR: Could not send forgot password email after security downgrade.\n',
                errorType: 'errors',
                errorMsg: 'Error sending the password reset message. Please try again shortly.',
                mailOptions,
                req
            };
            return Mailer.sendMail(mailOptions);
        };
        createRandomToken
            .then(setRandomToken)
            .then(sendForgotPasswordEmail)
            .then(() => res.redirect('/forgot'))
            .catch(next);
    }
    ;
}
