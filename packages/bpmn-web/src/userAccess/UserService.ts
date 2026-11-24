import crypto from 'node:crypto';
import { connectMongoose } from './userStore.js';
import User from './models/User.js';

/** What a user name may be: what assignments, task lists, the APIs (x-acting-user) and the logs name a user by. */
export const USER_NAME_RULE = 'A user name is 2 to 64 letters, digits or . _ @ -';
/** Why a user name can't be used, or null when it can. */
export function userNameProblem(userName): string | null {
	return typeof userName === 'string' && /^[A-Za-z0-9._@-]{2,64}$/.test(userName) ? null : USER_NAME_RULE;
}

/** bpmn-web's own users (its default user manager, UserManager): on the engine's store. */
export class UserService {
	static initialized = false;	
	constructor() {

		if (UserService.initialized)
			return;
		
		UserService.initialized = true;
		setImmediate(() => {
			this.init();
		});
    }
	async findUsers(query) {
		return await User.find(query);
	}
	async findUser(query) {
		return await User.findOne(query);
	}
	/** Every user, by user name, as plain objects. */
	async listUsers() {
		return await User.find({}).sort({ userName: 1 }).lean();
	}
	/** Every user document, under the users collection's name: for a backup. */
	async backup(): Promise<Record<string, any[]>> {
		return { [User.collection.collectionName]: await User.find({}).lean() };
	}
	/** The user of this name, whatever its case: `User1` is `user1`, so one can't pass for the other. */
	async userNamed(userName) {
		return await User.findOne({ userName }).collation({ locale: 'en', strength: 2 });
	}
	/** A new user; the user of that name or email when there is one already. A name against the rule is refused. */
	async addUser(userName, email, password, userGroups) {
		const problem = userNameProblem(userName);
		if (problem) throw new Error(`${problem}: '${userName}'`);
		let exist = await this.userNamed(userName);
		if (exist) {
			console.log(`user '${userName}' already exists`);
			return exist;
		}
		exist = await User.findOne({ email: email });
		if (exist) {
			console.log("user already exists with this email", email);
			return exist;
		}

		const user = new User({
			userName, email, password, userGroups
		});

		await user.save();
		return user;
	}
	async setPassword(userName, password) {

		let user = await User.findOne({ userName });
		if (!user) {
			console.log("User does not exist")
			return;
        }
		user.password = password;

		await user.save();

	}
	/**
	 * The first user: admin, with the password ADMIN_PASSWORD (a server's install sets it), else 'admin'; only when
	 * there are no users at all. start() runs this on every start: a server whose users have other names must not
	 * gain an administrator with a known password. Returns true when it made the user.
	 */
	/**
	 * The first user: `admin`, with ADMIN_PASSWORD, or one made up here and printed once where the server runs, so a
	 * new server can be signed into without a page asking for it. ADMIN_EMAIL is its address, else admin@example.com.
	 * Only where there are no users at all: a server whose users have other names must not gain an administrator.
	 */
	async install(): Promise<boolean> {
		if (await User.countDocuments({}) > 0)
			return false;
		const made = !process.env.ADMIN_PASSWORD;
		// a password nobody can guess, not admin/admin: whoever reads the console owns the server
		const password = process.env.ADMIN_PASSWORD || crypto.randomBytes(12).toString('base64url');
		const email = process.env.ADMIN_EMAIL || 'admin@example.com';
		await this.addUser('admin', email, password, ['ADMIN']);
		console.log(made
			? ['', '  The administrator of this new server:', '    user:     admin',
				`    password: ${password}`, `    email:    ${email}`,
				'  Printed once. Change it on My account, or set ADMIN_PASSWORD in .env before the first start.', ''].join('\n')
			: ` adding new User for 'admin'  password: (ADMIN_PASSWORD)`);
		return true;
    }

	/** How many users there are. */
	async count(): Promise<number> {
		return User.countDocuments({});
	}

	init() {
		connectMongoose();

	}

}
