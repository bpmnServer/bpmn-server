import { IUserService } from '../index.js';
import mongoose from 'mongoose';
import User from './models/User.js';

export class UserService implements IUserService {
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
	async addUser(userName, email, password, userGroups) {
		let exist = await User.findOne({ userName: userName });
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
	 * The first user (admin, password admin), only when there are no users at all. start() runs this on every
	 * start: a server whose users have other names must not gain an administrator with a known password.
	 * Returns true when it made the user.
	 */
	async install(): Promise<boolean> {
		if (await User.countDocuments({}) > 0)
			return false;
		console.log(` adding new User for 'admin'  password: 'admin'`);
		await this.addUser('admin', 'admin@mySite.com', 'admin', ['ADMIN']);
		return true;
    }

	init() {
		mongoose.set('strictQuery', false);
		mongoose.connect(process.env.MONGO_DB_URL);
		mongoose.connection.on('error', (err) => {
			console.error(err);
			console.log('%s MongoDB connection error. Please make sure MongoDB is running.');
			process.exit();
		});
		mongoose.connection.on('connected',()=> {
		});

	}

}
