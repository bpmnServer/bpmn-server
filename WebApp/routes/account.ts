import { Common} from "./common";

const express = require('express');

const lusca = require('lusca');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, 'uploads') });

/**
 * Controllers (route handlers).
 */
const userController = require('../controllers/user').UserController;

export class Account extends Common{

	config() {
		var router = express.Router();
		const passportConfig = this.webApp.passportConfig;
		const passport = this.webApp.passport;

		/**
		 * Primary app routes.
		 */
		router.get('/admin', userController.admin);
		router.get('/login', userController.getLogin);
		router.post('/login', userController.postLogin);
		router.get('/logout', userController.logout);
		router.get('/forgot', userController.getForgot);
		router.post('/forgot', userController.postForgot);
		router.get('/reset/:token', userController.getReset);
		router.post('/reset/:token', userController.postReset);
		router.get('/signup', userController.getSignup);
		router.post('/signup', userController.postSignup);
		router.get('/account/edit/:userId', this.isAuthenticated, userController.getEdit);
		router.post('/account/edit', this.isAuthenticated, userController.postEdit);
		router.get('/account/verify', this.isAuthenticated, userController.getVerifyEmail);
		router.get('/account/verify/:token', this.isAuthenticated, userController.getVerifyEmailToken);
		router.get('/account', this.isAuthenticated, userController.getAccount);
		router.post('/account/profile', this.isAuthenticated, userController.postUpdateProfile);
		router.post('/account/password', this.isAuthenticated, userController.postUpdatePassword);
		router.post('/account/delete', this.isAuthenticated, userController.postDeleteAccount);
		router.get('/account/unlink/:provider', this.isAuthenticated, userController.getOauthUnlink);

		/**
		 * OAuth authentication routes. (Sign in)
		 */
		router.get('/auth/instagram', passport.authenticate('instagram', { scope: ['basic', 'public_content'] }));
		router.get('/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/login' }), (req, res) => {
			res.redirect(req.session.returnTo || '/');
		});
		router.get('/auth/snapchat', passport.authenticate('snapchat'));
		router.get('/auth/snapchat/callback', passport.authenticate('snapchat', { failureRedirect: '/login' }), (req, res) => {
			res.redirect(req.session.returnTo || '/');
		});
		router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
		router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
			res.redirect(req.session.returnTo || '/');
		});
		router.get('/auth/github', passport.authenticate('github'));
		router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
			res.redirect(req.session.returnTo || '/');
		});
		router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email', 'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets.readonly'], accessType: 'offline', prompt: 'consent' }));
		router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
			res.redirect(req.session.returnTo || '/');
		});
		router.get('/auth/twitter', passport.authenticate('twitter'));
		router.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), (req, res) => {
			res.redirect(req.session.returnTo || '/');
		});
		router.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));
		router.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), (req, res) => {
			res.redirect(req.session.returnTo || '/');
		});
		router.get('/auth/twitch', passport.authenticate('twitch', {}));
		router.get('/auth/twitch/callback', passport.authenticate('twitch', { failureRedirect: '/login' }), (req, res) => {
			res.redirect(req.session.returnTo || '/');
		});

		/**
		 * OAuth authorization routes. (API examples)
		 */
		router.get('/auth/foursquare', passport.authorize('foursquare'));
		router.get('/auth/foursquare/callback', passport.authorize('foursquare', { failureRedirect: '/api' }), (req, res) => {
			res.redirect('/api/foursquare');
		});
		router.get('/auth/tumblr', passport.authorize('tumblr'));
		router.get('/auth/tumblr/callback', passport.authorize('tumblr', { failureRedirect: '/api' }), (req, res) => {
			res.redirect('/api/tumblr');
		});
		router.get('/auth/steam', passport.authorize('openid', { state: 'SOME STATE' }));
		router.get('/auth/steam/callback', passport.authorize('openid', { failureRedirect: '/api' }), (req, res) => {
			res.redirect(req.session.returnTo);
		});
		router.get('/auth/pinterest', passport.authorize('pinterest', { scope: 'read_public write_public' }));
		router.get('/auth/pinterest/callback', passport.authorize('pinterest', { failureRedirect: '/login' }), (req, res) => {
			res.redirect('/api/pinterest');
		});
		router.get('/auth/quickbooks', passport.authorize('quickbooks', { scope: ['com.intuit.quickbooks.accounting'], state: 'SOME STATE' }));
		router.get('/auth/quickbooks/callback', passport.authorize('quickbooks', { failureRedirect: '/login' }), (req, res) => {
			res.redirect(req.session.returnTo);
		});

		return router;

    }
}
