import { UserService, userNameProblem } from '../../userAccess/UserService.js';
import User from '../../userAccess/models/User.js';
import { Tokens } from './tokens.js';

/*
 * The users, for an administrator (their own token, or the service key; never an AI link, whatever its level: a
 * person's details are not an agent's to read, and changing them is not advising). Changing a user's groups, or
 * deleting them, ends their tokens: their rights change at once.
 */
export class UserError extends Error {
    constructor(readonly status: number, message: string, readonly code: string) { super(message); }
}

const asUser = u => ({ userName: u.userName, email: u.email ?? null, groups: u.userGroups ?? [] });
const groupsOf = (groups: unknown): string[] => {
    if (!Array.isArray(groups) || groups.some(g => typeof g !== 'string' || !g.trim()))
        throw new UserError(400, 'groups is a list of names', 'BAD_GROUPS');
    return [...new Set(groups.map(g => g.trim()))];
};

export class UserOperations {
    private readonly users = new UserService();
    constructor(readonly server) { }

    private async find(userName: string) {
        const user = await this.users.userNamed(userName);
        if (!user) throw new UserError(404, `No user ${userName}`, 'USER_NOT_FOUND');
        return user;
    }

    async list() {
        return { items: (await this.users.listUsers()).map(asUser) };
    }

    async add({ userName, email, password, groups = [] }: any) {
        const problem = typeof userName === 'string' ? userNameProblem(userName) : 'userName is required';
        if (problem) throw new UserError(400, problem, 'BAD_USER');
        if (typeof password !== 'string' || password.length < 8) throw new UserError(400, 'password: 8 characters at least', 'BAD_PASSWORD');
        if (await this.users.userNamed(userName)) throw new UserError(409, `There is a user ${userName} already`, 'USER_EXISTS');
        if (email && await this.users.findUser({ email })) throw new UserError(409, `There is a user with ${email} already`, 'EMAIL_EXISTS');
        return asUser(await this.users.addUser(userName, email ?? undefined, password, groupsOf(groups)));
    }

    async setGroups(userName: string, groups: unknown) {
        const user = await this.find(userName);
        user.userGroups = groupsOf(groups);
        await user.save();
        await new Tokens(this.server).revoke(user.userName);
        return asUser(user);
    }

    async setPassword(userName: string, password: unknown) {
        if (typeof password !== 'string' || password.length < 8) throw new UserError(400, 'password: 8 characters at least', 'BAD_PASSWORD');
        const user = await this.find(userName);
        user.password = password;
        await user.save();
        return { userName: user.userName, passwordSet: true };
    }

    async remove(userName: string, by: string) {
        const user = await this.find(userName);
        if (user.userName === by) throw new UserError(409, 'An administrator does not delete themselves', 'SELF');
        await User.deleteOne({ _id: user._id });
        await new Tokens(this.server).revoke(user.userName);
        return { deleted: user.userName };
    }
}
