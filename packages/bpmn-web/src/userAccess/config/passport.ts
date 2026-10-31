import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import UserModel from '../models/User.js';

passport.serializeUser((user, done) => {
  done(null, (user as any).id);
});

passport.deserializeUser((id, done) => {
    let user;
    UserModel.findById(id).then(function (user) {
        done(null, user);
    });
    
  
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'userName' }, async function (userName, password, done: (err: any, user?: any, options?: any) => void)  {
    let user = await UserModel.findOne({ userName: userName.toLowerCase() });

    if (!user) {
      return done(null, false, { msg: `UserName ${userName} not found.` });
    }
    if (!user.password) {
      return done(null, false, { msg: 'Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.' });
    }
    (user as any).comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if (isMatch) {
        return done(null, user);
      }
      return done(null, false, { msg: 'Invalid email or password.' });
    
  });
}));
