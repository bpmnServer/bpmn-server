import { Common} from "../../routes/common.js";

import express from 'express';


/**
 * Controllers (route handlers).
 */
import { UserController as userController } from '../controllers/user.js';

export class Account extends Common{
	passport;
	constructor(userManager) {
		super(userManager.app);
		this.passport = userManager.passport;
    }
	config() {
		var router = express.Router();
		const passport = this.passport;

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
		router.get('/account/edit/:id', this.isAuthenticated, this.isAdmin, userController.getEdit);
		router.post('/account/edit', this.isAuthenticated, this.isAdmin, userController.postEdit);
		router.get('/account/verify', this.isAuthenticated, userController.getVerifyEmail);
		router.get('/account/verify/:token', this.isAuthenticated, userController.getVerifyEmailToken);
		router.get('/account', this.isAuthenticated, userController.getAccount);
		router.post('/account/profile', this.isAuthenticated, userController.postUpdateProfile);
		router.post('/account/password', this.isAuthenticated, userController.postUpdatePassword);
		router.post('/account/delete', this.isAuthenticated, userController.postDeleteAccount);
		router.get('/account/unlink/:provider', this.isAuthenticated, userController.getOauthUnlink);

		// The OAuth sign-in/authorization routes that ship with the upstream
		// hackathon-starter template were removed: their passport strategies are
		// not registered (the strategy packages are not dependencies), so every
		// one of these endpoints threw "Unknown authentication strategy" at
		// runtime. Local username/password (passport-local) is the supported login.
		// Re-add a provider by installing its passport-* package, registering the
		// strategy in config/passport.ts, and restoring its routes here.

		return router;

    }
}
