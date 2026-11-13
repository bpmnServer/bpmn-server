/**
 * One protocol for every decision table bpmn-server evaluates (docs/design/decision-context.md): a business rule
 * task's decision, a user task's assignment policy, a case's security policy. They read the same inputs, prepared
 * the same way; what differs is only what their outputs mean (a result, an assignee and candidates, what a person
 * may do) and their hit policy (an assignment policy's first rule, a security policy's every rule).
 *
 * The context a table reads, each over the ones before it:
 *   1. the case data, its fields by name (`amount`), as a business rule task has always read them;
 *   2. the task's prepared inputs (its camunda:inputOutput input parameters, evaluated and awaited when it starts:
 *      `$(appServices.managerOf(this.data.requesterId))`), by name;
 *   3. the protocol's own: `data` (the case data whole: `data.amount`), `user` ({ userName, groups }), `groups`,
 *      `relation` (the person's relations to the case: initiator, assignee, candidate, participant), `initiator` (who
 *      started it), `task` (the element the decision is about), `decision` (what is deciding). The case data can't
 *      set these: a security policy's `groups` is never a field someone typed;
 *   4. the application's facts: appDelegate.decisionContext(context, about), when it has one (awaited), returning what
 *      it adds (`{ managerOf: true }`, a person's groups when only the application knows them).
 */
export type Relation = 'initiator' | 'assignee' | 'candidate' | 'participant';
/** What is deciding: a business rule task's decision, an assignment policy, a security policy. */
export type DecisionKind = 'decision' | 'assignment' | 'security';

/** The person acting (the operation's user) or asking (a security policy): a name and groups. */
export interface IDecisionUser {
    userName?: string | null;
    userGroups?: string[];
}

/** What a decision is about, as the application's hook is told. */
export interface IDecisionAbout {
    kind: DecisionKind;
    /** the decision's or the policy's name */
    name?: string;
    user: IDecisionUser;
    instance?: any;
    task?: string;
}

/** The names the protocol sets: the case data and the prepared inputs can't. */
export const DECISION_KEYS = ['data', 'user', 'groups', 'relation', 'initiator', 'task', 'decision'] as const;

const asList = (value): string[] => (Array.isArray(value) ? value : value == null || value === '' ? [] : String(value).split(','))
    .map(v => String(v ?? '').trim()).filter(Boolean);

/** Who started the case: its start event's user, else its first item's, else the instance's. */
export function initiatorOf(instance: any): string | null {
    const items: any[] = instance?.items ?? [];
    const start = items.find(i => i.type === 'bpmn:StartEvent' && i.userName);
    const first = [...items].sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0))[0];
    return start?.userName ?? first?.userName ?? instance?.userName ?? null;
}

/** The relations a person has to a case, from its items (and who started it). */
export function relationsOf(user: IDecisionUser, instance: any): Relation[] {
    const relations = new Set<Relation>();
    const me = user?.userName;
    if (!me) return [];
    const items: any[] = instance?.items ?? [];
    const groups = user.userGroups ?? [];
    const first = [...items].sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0))[0];
    if (items.some(i => i.type === 'bpmn:StartEvent' && i.userName === me) || first?.userName === me || instance?.userName === me)
        relations.add('initiator');
    for (const item of items) {
        if (item.type !== 'bpmn:UserTask') continue;
        const waiting = item.status === 'wait';
        if (waiting && item.assignee === me) relations.add('assignee');
        if (waiting && (!item.assignee || item.assignee === me)
            && (asList(item.candidateUsers).includes(me) || asList(item.candidateGroups).some(g => groups.includes(g))))
            relations.add('candidate');
        if (item.status === 'end' && item.userName === me) relations.add('participant');
    }
    if (relations.has('assignee') || relations.has('candidate')) relations.add('participant');
    return [...relations];
}

/**
 * The context a decision table reads (see above). `data`: the case data; `input`: the task's prepared inputs;
 * `appDelegate`: the application's, for its decisionContext hook; `log`: where a failing hook is said.
 */
export async function decisionContext({ data, input, user, instance, task, kind, name, appDelegate, log }: {
    data?: Record<string, any>; input?: Record<string, any>; user?: IDecisionUser; instance?: any; task?: string;
    kind: DecisionKind; name?: string; appDelegate?: any; log?: (message: string) => void;
}): Promise<Record<string, any>> {
    const caseData = data && typeof data === 'object' ? data : {};
    const person: IDecisionUser = { userName: user?.userName ?? null, userGroups: user?.userGroups ?? [] };
    const context: Record<string, any> = {
        ...caseData,
        ...(input && typeof input === 'object' ? input : {}),
        data: caseData,
        user: { userName: person.userName, groups: person.userGroups },
        groups: person.userGroups,
        relation: relationsOf(person, instance),
        initiator: initiatorOf(instance),
        task: task ?? '',
        decision: { kind, name: name ?? '' },
    };
    if (typeof appDelegate?.decisionContext === 'function') {
        try {
            const facts = await appDelegate.decisionContext(context, { kind, name, user: person, instance, task } as IDecisionAbout);
            if (facts && typeof facts === 'object') Object.assign(context, facts);
            // groups said by the application: the person's, everywhere they are read
            if (Array.isArray(facts?.groups)) context.user = { ...context.user, groups: facts.groups };
        }
        catch (error) {
            log?.(`decisionContext failed (${kind} ${name ?? ''}): ${error?.message ?? error}; decided without the application's facts`);
        }
    }
    return context;
}
