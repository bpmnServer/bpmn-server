import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import mongoose from "mongoose";
import { isAdminGroups, isDesignerGroups } from "../roles.js";


const userSchema = new mongoose.Schema({
    userName: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerificationToken: String,
    emailVerified: Boolean,
    userGroups: [],
    tenantId: String,
    snapchat: String,
    facebook: String,
    twitter: String,
    google: String,
    github: String,
    instagram: String,
    linkedin: String,
    steam: String,
    twitch: String,
    quickbooks: String,
    tokens: Array,
    profile: {
        name: String,
        gender: String,
        location: String,
        website: String,
        picture: String
    }
}, { timestamps: true });
/**
 * Password hash middleware.
 */
// Mongoose 9 no longer passes `next` to pre hooks: the hook is async, and a throw rejects the save.
userSchema.pre('save', async function save(this: any) {
    const user = this;
    if (!user.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
});
/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        cb(err, isMatch);
    });
};
/**
 * Helper method for getting user's gravatar.
 */
userSchema.virtual('isAdmin').get(function () {
    return isAdminGroups(this.userGroups);
});
/** May work on models (see roles.ts). */
userSchema.virtual('isDesigner').get(function () {
    return isDesignerGroups(this.userGroups);
});
userSchema.methods.hasGroup = function hasGroup(group) {
    if (this.userGroups && this.userGroups.indexOf(group) !== -1)
        return true;
    else
        return false;
};
/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function gravatar(size) {
    if (!size) {
        size = 200;
    }
    if (!this.email) {
        return `https://gravatar.com/avatar/?s=${size}&d=retro`;
    }
    const md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};
const User = mongoose.model('User', userSchema);
export default User;
//# sourceMappingURL=User.js.map
