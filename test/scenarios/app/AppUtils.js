// What the scenario models' scripts reach as `appUtils`: date arithmetic, and notifications (sent as
// plain text through the delegate's sendEmail, to the users the server's userService knows, if any).
import dayjs from 'dayjs';

export class AppUtils {
  constructor(server) {
    this.server = server;
  }

  dateAdd(date1, amount, units) {
    return dayjs(date1).add(amount, units).toDate();
  }

  async notifyOfDueDate({ item, daysBefore, message = 'Item is due' }) {
    return this.notify({ to: [item.assignee, item.candidateUsers, item.candidateGroups], item, message });
  }

  async notifyAssigned({ item, message = 'New Task Assigned' }) {
    return this.notify({ to: [item.assignee], item, message });
  }

  async notify({ to, item, message }) {
    for (const user of await this.getUsers(to)) {
      await this.server.appDelegate.sendEmail(user.email, message, `${message}: ${item?.name ?? item?.elementId ?? ''}`);
    }
  }

  async getUsers(toList) {
    const users = [];
    for (const to of toList ?? []) {
      if (to?.user) users.push(...to.user);
      else if (to?.group) for (const group of to.group) users.push(...(await this.getUserNamesInGroup(group)));
    }
    return this.getUsersInfo([...new Set(users)]);
  }

  async getUserNamesInGroup(group) {
    const users = (await this.server.userService?.findUsers({ userGroups: group })) ?? [];
    return users.map((u) => u.userName);
  }

  async getUsersInfo(users) {
    const info = [];
    for (const userName of users) {
      const user = await this.server.userService?.findUser({ userName });
      if (user) info.push({ userName, email: user.email });
    }
    return info;
  }
}
