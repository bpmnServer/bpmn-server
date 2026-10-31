// The service tasks the scenario models call (`camunda:delegateExpression` / `implementation`), and
// the services their scripts reach as `appServices`.
import { ApprovalManager } from './ApprovalManager.js';

const delay = (ms, result) => new Promise((resolve) => setTimeout(() => resolve(result), ms));

export class AppServices {
  constructor(delegate) {
    this.appDelegate = delegate;
  }

  async echo(input, context) {
    context.item.data['echo'] = input;
    return input;
  }

  /** A call to another system, as a model's service may make. */
  async webService(method, url, data, headers) {
    const response = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json', ...headers },
      ...(method === 'POST' && data ? { body: JSON.stringify(data) } : {}),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return response.json();
  }

  async service99() { }
  async notifyhead() { }
  async getCollection(token) { return ['A', 'B', 'C']; }
  async flowCondition(input) { return false; }

  /** A boundary timer's delay from its task's priority. */
  getTimerDelay(item) {
    const priority = item.token.parentToken.currentItem.priority;
    if (priority === 'high') return 'PT5S';
    if (priority === 'medium') return 'PT10S';
    if (priority === 'low') return 'PT15S';
  }

  async add({ v1, v2 }, context) {
    return Number.parseInt(v1) + Number.parseInt(v2);
  }

  /** Whether the stage of `context.itemKey` (`<stage>.<team>.<n>`) is approved by its completed user tasks. */
  IsApprovalDone(context) {
    if (context.itemKey == null) return false;
    const stage = context.itemKey.split('.')[0];
    const completed = {};
    for (const item of context.token.execution.getItems()) {
      if (item.itemKey && item.status === 'end' && item.endedAt !== null && item.type == 'bpmn:UserTask' && item.itemKey.startsWith(stage + '.')) {
        const team = item.itemKey.split('.')[1];
        completed[team] = (completed[team] || 0) + 1;
      }
    }
    return ApprovalManager.isStageApproved(stage, completed);
  }

  /** One item key per approver a stage needs: `<stage>.<team>.<n>`. */
  async getApprovers(stage) {
    const items = [];
    for (const [team, approvers] of Object.entries(ApprovalManager.getRequiredTeams(stage) ?? {})) {
      for (let i = 0; i < approvers; i++) items.push(stage + '.' + team + '.' + (i + 1));
    }
    return items;
  }

  async service1(input, context) {
    const item = context.item;
    item.vars = input;
    await delay(input.wait ? input.wait : 5000, 'test');
    return { text: 'test' };
  }

  async DummyService1(input, context) {
    context.item.data.service1Result = 'Service1Exec';
  }

  async raiseBPMNError(input, context) {
    return { bpmnError: ' Something went wrong' };
  }
}
