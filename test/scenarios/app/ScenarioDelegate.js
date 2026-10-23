// The scenarios' application delegate (from bpmn-web's WorkflowApp): the services the models call,
// the utilities their scripts use, and e-mail written to EMAIL_LOG (never sent).
import fs from 'node:fs';
import { DefaultAppDelegate } from '../../../dist/index.js';
import { AppServices } from './AppServices.js';
import { AppUtils } from './AppUtils.js';

export class ScenarioDelegate extends DefaultAppDelegate {
  constructor(server) {
    super(server);
    this.appUtils = new AppUtils(server);
    this.appServices = null;
  }

  async getServicesProvider(context) {
    this.appServices ??= new AppServices(this);
    return this.appServices;
  }

  /** On start (with timers): reports items left running, and removes locks over a day old. */
  async startUp(options) {
    await super.startUp(options);
    if (options['cron'] == false) return;
    const hung = await this.server.dataStore.findItems({ 'items.status': 'start' });
    if (hung.length > 0) this.server.logger.log('** There are ' + hung.length + ' items that seem to be hung');
    const dayAgo = new Date();
    dayAgo.setDate(dayAgo.getDate() - 1);
    await this.server.dataStore.locker.delete({ time: { $lte: dayAgo } });
  }

  async sendEmail(to, subject, text) {
    const log = process.env.EMAIL_LOG;
    if (log) fs.appendFileSync(log, `\n\nto:${to}\n${subject}\n${text}\n`);
    return 'email not sent: scenarios';
  }

  async executionEnded(execution) { }
  async executionEvent(context, event) { }
  async serviceCalled(input, context) {
    this.server.logger.log('service called');
  }
}
