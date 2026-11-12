
import { Node } from './Node.js';
import { applyPolicy } from '../engine/AssignmentPolicy.js';

import { Token, TOKEN_TYPE } from '../engine/Token.js';
import { BPMN_TYPE, ITEM_STATUS, NODE_ACTION, TOKEN_STATUS } from '../interfaces/Enums.js'

import { Process } from './Process.js';
import { IExecution } from '../interfaces/engine.js';
import { EXECUTION_STATUS } from '../interfaces/Enums.js';
import { Item } from '../engine/Item.js';
import { ScriptHandler } from '../engine/ScriptHandler.js';
import { expressionScript, templateParts, evaluateTemplate } from '../engine/Expressions.js';
import type { IAppDelegate, IServiceProvider } from '../interfaces/common.js';

import { DMNEngine } from '../dmn/DMNEngine.js';
import { ConnectorError } from '../connectors/Connectors.js';
import { ConnectorBehaviour } from './behaviours/Connector.js';
import { Behaviour_names } from './behaviours/BehaviourLoader.js';

// ---------------------------------------------
class ScriptTask extends Node {
    async run(item): Promise<NODE_ACTION> {

        if (this.def.script) {
            item.token.log('executing script task');
            item.token.log(this.def.script);
            let ret=await item.context.scriptHandler.executeScript(item, this.def.script, 'script');
            if (ret && ret.escalation) {
                await item.token.processEscalation(ret.escalation,item);
            }
            if (ret && ret.bpmnError) {
                await item.token.processError(ret.bpmnError,item);
            }
        }
        return NODE_ACTION.end;
    }
}
/**
 * ```ts
 *      foo[method]();
 *      
 *      await this.token.appDelegate[serviceName](data);
 *      
 *      
 *      service signature:
 *              output= service (input,context)
 * ```
 */
class ServiceTask extends Node {
    get serviceName() {
        if (this.def.implementation && typeof this.def.implementation!=='undefined') {
            return this.def.implementation;
        }
        else if (this.def.delegateExpression) {
            return this.def.delegateExpression;
        }

    }
    /** The task's camunda:connector, when it calls a connector instead of a service. */
    get connector(): ConnectorBehaviour | undefined {
        return this.getBehaviour(Behaviour_names.CamundaConnector);
    }

    /**
     * A connector's operation called with the connector's inputs; the response is the output. A status other than
     * 2xx raises the BPMN error HTTP_<status> (a boundary error event catches it), as a service's bpmnError does.
     */
    async runConnector(item: Item, connector: ConnectorBehaviour): Promise<NODE_ACTION> {
        const what = `${item.node.name ? `'${item.node.name}' (${item.node.id})` : item.node.id}`;
        if (item.context.configuration?.runServiceTasks === false) {
            item.token.decision({
                seq: item.seq, element: `service task ${what}`, action: 'ends with no output',
                why: [`a real server calls the connector ${connector.connectorId} here`, 'connectors do not run on this server'],
            });
            item.output = {};
            return NODE_ACTION.end;
        }
        const connectors = item.token.execution.server?.connectors;
        if (!connectors)
            throw new Error(`service task ${what}: this server has no connectors`);
        try {
            const { output } = await connectors.call(connector.connectorId, item.input ?? {}, { log: line => item.log(line) });
            item.output = output;
        }
        catch (error) {
            if (!(error instanceof ConnectorError))
                throw error;
            item.log(error.message);
            item.token.decision({
                seq: item.seq, element: `service task ${what}`, action: `raises the BPMN error ${error.code}`,
                why: [`the connector ${connector.connectorId} answered HTTP ${error.status}`],
            });
            item.output = { status: error.status, error: error.body };
            await item.token.processError(error.code, item);
        }
        return NODE_ACTION.end;
    }

    async run(item: Item): Promise<NODE_ACTION> {

        item.context.action = null;
        item.context.item = item;
        const connector = this.connector;
        if (connector)
            return this.runConnector(item, connector);
        // calling appDelegate by service name
        const appDelegate: IAppDelegate = item.token.execution.appDelegate;

        // let output = await item.node.getOutput(item);

        let ret;

        // a test's stub stands for the service: it calls nothing, so it runs wherever service tasks do not
        const stub = (await item.token.execution.server.testStubs?.of(item.token.execution))?.services?.[this.serviceName];

        // stubbed by a test that has ended, or by an engine since restarted: its instance goes on, and does not reach the real service
        if (!stub && item.token.execution.instance.flags?.stubbed?.includes(this.serviceName)) {
            item.token.decision({
                seq: item.seq, element: `service task ${item.node.name ? `'${item.node.name}' (${item.node.id})` : item.node.id}`, action: 'ends with no output',
                why: [`a test stubbed the service ${this.serviceName} for this instance`, 'that test has ended, and the real service is not called'],
            });
            item.output = {};
            return NODE_ACTION.end;
        }

        if (!stub && item.context.configuration?.runServiceTasks === false) {
            item.token.decision({
                seq: item.seq, element: `service task ${item.node.name ? `'${item.node.name}' (${item.node.id})` : item.node.id}`, action: 'ends with no output',
                why: [`a real server calls ${this.serviceName ? `the service ${this.serviceName}` : 'its service'} here`, 'service tasks do not run on this server'],
            });
            item.output = {};
            return NODE_ACTION.end;
        }

        item.log("invoking service:" + this.serviceName + " input:" + JSON.stringify(item.input));

        const servicesProvider= stub ? null : await appDelegate.getServicesProvider(item.token.execution);

        let obj = servicesProvider;

        let method: CallableFunction | undefined;
        // The object the service is a method of: it is called as its method (`this` is it).
        let owner: IServiceProvider | undefined;
        if (obj && this.serviceName)  {
            const serviceNamePathPart = this.serviceName.split('.');
            for (var i = 0; i <= serviceNamePathPart.length - 1; i++) {
                const pathPart = serviceNamePathPart[i];
                if (typeof obj[pathPart] === 'function') {
                    method = obj[pathPart] as CallableFunction;
                    owner = obj;
                } else if (typeof obj[pathPart] === 'object') {
                    obj = obj[pathPart] as IServiceProvider;
                }
            }
        }

        if (stub) {
            ret = await stub(item.input, item.data);
        } else if (typeof method === 'function') {
            ret = await (method as Function).call(owner, item.input, item.context);
        } else {
            ret = await appDelegate['serviceCalled'](item.input, item.context, item);
        }
        
        item.log("service returned " + ret);
        item.output = ret;
        item.log('service '+ this.serviceName+' completed-output:' + ret + item.output);
        // await item.node.setInput(item,ret);

        if (ret && ret.escalation) {
            await item.token.processEscalation(ret.escalation,item);
        }
        if (ret && ret.bpmnError) {
            await item.token.processError(ret.bpmnError,item);
        }


        if (item.context.action && item.context.action == NODE_ACTION.wait) {

            return item.context.action;
        }

        return NODE_ACTION.end;
    }
    describe() {

        let desc = super.describe();
        desc.push([`Service Delegate`,` ${this.serviceName}`]);
        return desc;
    }
}
//    <bpmn2:businessRuleTask id="Task_1" name="Vacation" camunda:decisionRef="Vacation" camunda:resultVariable="vacation">
/**
 * Evaluates the decision camunda:decisionRef names, in the models folder: the file `<ref>.dmn.xml`, or a decision
 * with that id. Its inputs are read from the instance data and the task's input parameters (which take precedence);
 * the result is the task's output, saved in the data by output parameters or camunda:resultVariable, shaped by
 * camunda:mapDecisionResult (singleEntry, singleResult, collectEntries or resultList) when that is set.
 */
class BusinessRuleTask extends ServiceTask {
    get decisionRef(): string { return camundaAttr(this.def, 'decisionRef'); }
    get resultVariable(): string { return camundaAttr(this.def, 'resultVariable'); }
    get mapDecisionResult(): string { return camundaAttr(this.def, 'mapDecisionResult'); }

    async run(item): Promise<NODE_ACTION> {
        const token: Token = item.token;
        const ref = this.decisionRef;
        if (!ref) {
            token.log('..business rule task has no decision (camunda:decisionRef); nothing evaluated');
            return NODE_ACTION.end;
        }
        const folder = token.execution.server.configuration.definitionsPath;
        const found = await DMNEngine.find(folder, ref);
        token.log(`..invoking business rule ${ref}: decision '${found.decision.name}' in ${found.filePath}`);
        const dmn = await new DMNEngine({ log: message => token.log(message) }).load(found.filePath, found.decision.id);

        const context = { ...(token.data || {}), ...(item.input || {}) };
        const result = dmn.evaluate(context);
        item.output = this.mapResult(result);
        if (this.resultVariable)
            token.data[this.resultVariable] = item.output;
        token.log(`..business rule ${ref} evaluated: ${JSON.stringify(item.output)}`);
        return NODE_ACTION.end;
    }

    /** The result as camunda:mapDecisionResult asks for it. */
    mapResult(result) {
        const list = result === null || result === undefined ? [] : Array.isArray(result) ? result : [result];
        const single = (what: string) => {
            if (list.length > 1)
                throw new Error(`Decision '${this.decisionRef}': mapDecisionResult ${what} needs one result; ${list.length} rules matched.`);
            return list.length ? list[0] : null;
        };
        const firstValue = (r) => r && typeof r === 'object' ? Object.values(r)[0] : r;
        switch (this.mapDecisionResult) {
            case 'singleEntry': return firstValue(single('singleEntry'));
            case 'singleResult': return single('singleResult');
            case 'collectEntries': return list.map(firstValue);
            case 'resultList': return list;
            default: return result;
        }
    }

    describe() {
        const desc = super.describe().filter(([label]) => label !== 'Service Delegate');
        desc.push(['Decision', this.decisionRef || '(none)']);
        if (this.resultVariable) desc.push(['Result variable', this.resultVariable]);
        if (this.mapDecisionResult) desc.push(['Result mapping', this.mapDecisionResult]);
        return desc;
    }
}

/** A camunda: attribute, whether or not the Camunda descriptors are loaded. */
function camundaAttr(def, name: string): string {
    return (def && def.$attrs && def.$attrs['camunda:' + name]) || (def && def[name]) || '';
}
class SendTask extends ServiceTask {

    get isCatching(): boolean { return false; } 
    /*
    async run(item): Promise<NODE_ACTION> {

        if (this.def.script) {
            item.token.log(this.def.script);
            await item.token.execution.appDelegate.scopeJS(item, this.def.script);
        }
        return NODE_ACTION.end;
    } */
}

class UserTask extends Node {

    async end(item: Item,cancel=false) {

        return await super.end(item,cancel);
    }
    async start(item: Item): Promise<NODE_ACTION> {
        if (this.def.$attrs)
            {
            await this.setAssignVal(item,"assignee");
            await this.setAssignVal(item,"candidateGroups");
            await this.setAssignVal(item,"candidateUsers");
            await this.setAssignVal(item,"dueDate",true);
            await this.setAssignVal(item,"followUpDate",true);
            await this.setAssignVal(item,"priority");
            }
        // a task in a lane is offered to the group of the lane's name too; a single candidate group is text, not a list
        if (this.lane && this.lane !=='')
            {
            const groups = item.candidateGroups == null ? [] : Array.isArray(item.candidateGroups) ? item.candidateGroups : [item.candidateGroups];
            if (!groups.includes(this.lane))
                groups.push(this.lane);
            item.candidateGroups = groups;
            }
        // its assignment policy, last: it wins over the attributes and the lane (engine/AssignmentPolicy.ts)
        const policy = this.def.$attrs?.['camunda:assignmentPolicy'];
        if (policy)
            await applyPolicy(this, item, String(policy).trim());

        return await super.start(item);
    }
    async setAssignVal(item,attr,dateFormat=false) {
        const exp=this.def.$attrs["camunda:"+attr];

        if (!exp)
            return;
        var val;
        if (expressionScript(exp) !== null)
        {
            val = await item.context.scriptHandler.evaluateExpression(item, exp, attr);
        }
        else if (exp.startsWith('#')) {
            val = await item.context.scriptHandler.executeScript(item, 'return '+exp.substring(1), attr);
        }
        else
        {
            // a text with ${...} parts is filled in first: group-${data.region}, ${data.a},${data.b}
            const text = templateParts(exp) ? await evaluateTemplate(item.context.scriptHandler, item, exp) : exp;
            val = text.includes(",") ? text.split(",") : text;
        }

        if (dateFormat)
            val=new Date(val);

        item[attr] = val;
        item.token.log('..setting attribute '+attr+' exp: '+exp+'='+val);
        //console.log('----setAttVal', attr, exp, val);
    }
    describe() {
        let attrs = ["assignee","candidateGroups", "candidateUsers", "assignmentPolicy", "label", "endLabel", "dueDate", "followUpDate", "priority"];
        let desc = super.describe();

        attrs.forEach(attr => {
            let val = this.def.$attrs["camunda:" + attr];
            if (val)
                desc.push([attr, val]);
        });
        return desc;
    }
    get requiresWait() { return true; }
    get canBeInvoked() { return true; }
}
class ReceiveTask extends Node {

    get isCatching(): boolean { return true; } 
    get requiresWait() { return true; }
    get canBeInvoked() { return true; }
}

class SubProcess extends Node {
    childProcess: Process;
    get requiresWait() { return true; }
    get canBeInvoked() { return false; }

    async start(item): Promise<NODE_ACTION> {

        const token = item.token;

        token.log('..executing a sub process item:' + item.id );
        const startNode = this.childProcess.getStartNodes()[0];

        item.status = ITEM_STATUS.wait;

        let dp;
        // check if am also a loop
        let isLoop=false;
        if (token.loop && token.path.length==1)
            dp=token.dataPath
        else if (token.dataPath!=='')
            dp=token.dataPath+'.'+this.id;
        else
            dp=this.id;

        const newToken = await Token.startNewToken(TOKEN_TYPE.SubProcess, token.execution,
                startNode, dp, token, item, null, null, true);

        await this.childProcess.start(token.execution,newToken);

        await this.startBoundaryEvents(item, newToken);
        // while it starts, a child that ends does not signal this item (Token.end): this start goes on, once.
        // (It did both: the parent went on twice, and a gateway after it failed on its second pass.)
        item['starting'] = true;
        try {
            await newToken.execute(null);
        }
        finally {
            delete item['starting'];
        }

        // An interrupting boundary event fired during the synchronous child execution
        // has terminated the child token; the subprocess must not take its outgoing
        // sequence flow.
        if (newToken.status === TOKEN_STATUS.terminated)
            return NODE_ACTION.end;
        if (newToken.status === TOKEN_STATUS.end) {     // done within its start: on
            item.status = ITEM_STATUS.start;
            return NODE_ACTION.continue;
        }
        if (item.status == ITEM_STATUS.wait)
            return NODE_ACTION.wait;
        else
            return NODE_ACTION.continue;
    }
}
/**
 * ad hoc behaviour:
 *  on `start of subprocess`:
 *      all nodes without in-flow will be started; user-tasks, timers, script/service tasks etc.
 *  on `end of subprocess`:
 *      all nodes that didn't finish, will be terminated
 *  To `end subprocess`:
 *  1.  any node can have flow to `end-event`
 *  2.  model can have an Exclusive-Gateway to terminate the subprocess at particular point
 *  3   a signal or message can be sent by a script
 */
class AdHocSubProcess extends Node {
    childProcess: Process;
    get requiresWait() { return true; }
    get canBeInvoked() { return false; }

    /**
     * Offers every activity without an incoming flow at once, each on its own token. The ad hoc sub-process
     * completes when all of them are done, when one reaches an end event, or when its completionCondition holds
     * after one is done (adHocTokenEnded).
     */
    async start(item): Promise<NODE_ACTION> {
        const token = item.token;
        token.log('..executing an ad hoc sub process item:' + item.id);

        item.status = ITEM_STATUS.wait;

        await this.childProcess.start(token.execution, token);
        await this.startBoundaryEvents(item, token);

        const tokens = [];
        for (const node of this.getAdHocNodes())
            tokens.push(await Token.startNewToken(TOKEN_TYPE.AdHoc, token.execution, node, this.id, token, item, null, null, true));
        for (const adHoc of tokens)
            await adHoc.execute(null);

        if (item.status == ITEM_STATUS.wait)
            return NODE_ACTION.wait;
        else
            return NODE_ACTION.continue;
    }
    /** An activity's token ended (not cancelled): complete the ad hoc sub-process when it is done. */
    async adHocTokenEnded(item: Item, ended: Token) {
        if (item.status != ITEM_STATUS.wait)
            return;
        const active = item.token.getChildrenTokens().filter(t => t.type == TOKEN_TYPE.AdHoc
            && t.status != TOKEN_STATUS.end && t.status != TOKEN_STATUS.terminated);
        let done = active.length == 0 || ended.currentNode.type == BPMN_TYPE.EndEvent;
        const condition = this.def.completionCondition?.body;
        if (!done && condition) {
            done = !!(await item.token.execution.scriptHandler.evaluateExpression(item, condition, 'completionCondition'));
            item.token.decision({
                seq: item.seq, element: `ad hoc sub-process ${this.id}`, action: done ? 'completes' : 'goes on',
                why: ['completionCondition', [condition], `result: ${done}`],
            });
        }
        if (!done)
            return;
        for (const t of active)
            await t.terminate();
        await item.token.signal(null);
    }
    async end(item,cancel) {
        return await super.end(item,cancel);
    }
    getAdHocNodes() {
        const nodes = this.childProcess.childrenNodes;

        const adHocs=[];

        nodes.forEach(node=>{
            switch(node.type) {
                case BPMN_TYPE.EndEvent:
                case BPMN_TYPE.SequenceFlow:
                    break;
                default:
                    if (node.inbounds.length==0)
                        adHocs.push(node);
                    break;
            }
        });
        return adHocs;
    }
    async run(item):Promise<any> {
        return super.run(item);

    }
}

/**
 * 
 * <callActivity id="callCheckCreditProcess" name="Check credit" calledElement="checkCreditProcess" />
 * 
 * the called process need to call me back when done.
 * 
 *  Scenario
 *      a process 'D1' element 'E' is a 'CallActivity' calling Definition 'D2'
 * steps:
 * 
 *      1.  Item 'E': item start: start event is fired to prepare for input
 *      2.  Item 'E': item start: executing the call process passing input
 *      3.  If Process 'D2' is completed immediatly
 *              we continue, skip next steps
  *     4.  Process 'D1' goes on a wait state
 *      5.  When the process 'D2' is completed it calls 'executionEnded'
 *      6.  We continue with Item:Invoke 
 *      7.  event 'end' is fired to handle output of the process
 *      
 *      
 * 
 * */
class CallActivity extends Node {
    get calledElement() {
        return this.def.calledElement;
    };

    get requiresWait() { return true; }
    get canBeInvoked() { return false; }

    /** Its output parameters (camunda:outputParameter): what of the called process's data comes back. */
    get outputParameters() {
        const io = this.getBehaviour(Behaviour_names.CamundaIO) as any;
        return (io?.parameters ?? []).filter(p => p.isOutput());
    }

    /**
     * A called process has ended: its caller's call activity continues, with the called process's data. When it
     * ended within its own start, the call activity is still running (`start` below takes the data, and
     * continues); otherwise the caller waits, and is invoked, as the user who ended the called process.
     */
    static async executionEnded(execution: IExecution) {
        // ended within the call that started it (the call activity is still running, not saved): `start` takes it
        if (execution.operation === 'start' || execution.options?.['calledBy'] === execution.instance.parentItemId) return;
        const itemId = execution.instance.parentItemId;
        const engine = execution.server.engine;
        await engine.invoke({ "items.id": itemId }, execution.instance.data, execution.userName);

    }

    /**
     * The called process's data, as the call's result. With output parameters, only what they say comes back
     * (`output` in them is the called process's data: `$output.decision`); without, all of it, as before.
     */
    async setInput(item: Item, input) {
        if (!this.outputParameters.length)
            return super.setInput(item, input);
        item.output = input ?? {};
    }

    async start(item): Promise<NODE_ACTION> {

        const token = item.token;

        token.log('..executing a call activity for item:' + item.id+ " calling "+this.calledElement);

        const context = item.context;
        const modelName = this.calledElement;
        const instance = token.execution.instance;
        // the called process runs as the user whose action reached here (else who started the caller: its first
        // item's user), in the caller's tenant: it has a user, and its instance is isolated as the caller's is
        const userName = token.execution.userName ?? token.execution.getItems()[0]?.userName ?? null;

        const response = await context.engine.start(modelName, item.input, null, userName,
            { parentItemId: item.id, calledBy: item.id, ...(instance.tenantId != null ? { tenantId: instance.tenantId } : {}), ...(instance.flags?.stubbed ? { flags: { stubbed: instance.flags.stubbed } } : {}) });

        token.log('..end of executing a call activity for item:' + item.id + " calling " + this.calledElement);

        token.log('..response :' + response.execution.status);

        if (response.execution.status == EXECUTION_STATUS.end) {
            // ended within its start: its data comes back here (it was lost)
            await this.setInput(item, response.instance.data);
            return NODE_ACTION.continue;
        }
        else
            return NODE_ACTION.wait;
    }
}


export {  UserTask, ScriptTask, ServiceTask, BusinessRuleTask, SendTask, ReceiveTask, SubProcess , CallActivity , AdHocSubProcess }