// bpmnlint (https://github.com/bpmn-io/bpmnlint) in the editor: modeling rules (labels, implicit splits, fake
// joins, superfluous gateways, ...) checked in the browser as the model is edited, listed under Problems with
// bpmn-server's own checks. Its configuration, bpmnlintrc.json (`npm run lint:models` uses the same file),
// starts from bpmnlint's recommended rules and:
//   - turns off what verifyModel already checks: start and end events, implicit starts and ends, disconnected
//     elements, gateways that join and fork, diagram information, event-based gateway targets;
//   - turns off no-inclusive-gateway: bpmn-server runs inclusive gateways;
//   - makes warnings of what bpmn-server runs but is likely a mistake: implicit splits, several blank start
//     events, start and end events in an ad hoc sub-process, a flow without a condition beside conditional ones;
//   - turns off label-required: bpmn-server needs no names, and unnamed start and end events are common (a team
//     can turn it on in the Rules dialog); a superfluous label is information.
// An error is left for what bpmn-server can not run (complex gateways, link events without a partner, ...).
// The team can change any rule's level for everyone (LintRules.js: bpmnlint.json in the models folder).
import { Linter } from 'bpmnlint';
import StaticResolver from 'bpmnlint/lib/resolver/static-resolver';
import recommended from 'bpmnlint/config/recommended';
import config from './bpmnlintrc.json';
import adHocSubProcess from 'bpmnlint/rules/ad-hoc-sub-process';
import conditionalFlows from 'bpmnlint/rules/conditional-flows';
import endEventRequired from 'bpmnlint/rules/end-event-required';
import eventBasedGateway from 'bpmnlint/rules/event-based-gateway';
import eventSubProcessTypedStartEvent from 'bpmnlint/rules/event-sub-process-typed-start-event';
import fakeJoin from 'bpmnlint/rules/fake-join';
import global from 'bpmnlint/rules/global';
import labelRequired from 'bpmnlint/rules/label-required';
import linkEvent from 'bpmnlint/rules/link-event';
import noBpmndi from 'bpmnlint/rules/no-bpmndi';
import noComplexGateway from 'bpmnlint/rules/no-complex-gateway';
import noDisconnected from 'bpmnlint/rules/no-disconnected';
import noDuplicateSequenceFlows from 'bpmnlint/rules/no-duplicate-sequence-flows';
import noGatewayJoinFork from 'bpmnlint/rules/no-gateway-join-fork';
import noImplicitEnd from 'bpmnlint/rules/no-implicit-end';
import noImplicitSplit from 'bpmnlint/rules/no-implicit-split';
import noImplicitStart from 'bpmnlint/rules/no-implicit-start';
import noInclusiveGateway from 'bpmnlint/rules/no-inclusive-gateway';
import noOverlappingElements from 'bpmnlint/rules/no-overlapping-elements';
import singleBlankStartEvent from 'bpmnlint/rules/single-blank-start-event';
import singleEventDefinition from 'bpmnlint/rules/single-event-definition';
import startEventRequired from 'bpmnlint/rules/start-event-required';
import subProcessBlankStartEvent from 'bpmnlint/rules/sub-process-blank-start-event';
import superfluousGateway from 'bpmnlint/rules/superfluous-gateway';
import superfluousLabel from 'bpmnlint/rules/superfluous-label';
import superfluousTermination from 'bpmnlint/rules/superfluous-termination';

const RULES = {
    'ad-hoc-sub-process': adHocSubProcess,
    'conditional-flows': conditionalFlows,
    'end-event-required': endEventRequired,
    'event-based-gateway': eventBasedGateway,
    'event-sub-process-typed-start-event': eventSubProcessTypedStartEvent,
    'fake-join': fakeJoin,
    'global': global,
    'label-required': labelRequired,
    'link-event': linkEvent,
    'no-bpmndi': noBpmndi,
    'no-complex-gateway': noComplexGateway,
    'no-disconnected': noDisconnected,
    'no-duplicate-sequence-flows': noDuplicateSequenceFlows,
    'no-gateway-join-fork': noGatewayJoinFork,
    'no-implicit-end': noImplicitEnd,
    'no-implicit-split': noImplicitSplit,
    'no-implicit-start': noImplicitStart,
    'no-inclusive-gateway': noInclusiveGateway,
    'no-overlapping-elements': noOverlappingElements,
    'single-blank-start-event': singleBlankStartEvent,
    'single-event-definition': singleEventDefinition,
    'start-event-required': startEventRequired,
    'sub-process-blank-start-event': subProcessBlankStartEvent,
    'superfluous-gateway': superfluousGateway,
    'superfluous-label': superfluousLabel,
    'superfluous-termination': superfluousTermination
};

const cache = { 'config:bpmnlint/recommended': recommended };
for (const [name, rule] of Object.entries(RULES))
    cache[`rule:bpmnlint/${name}`] = rule;

const resolver = new StaticResolver(cache);
const SEVERITY = { error: 'error', warn: 'warning', info: 'info' };

/**
 * What each rule checks, in a line (bpmnlint's rules carry only a documentation link); for one off here, why: most
 * are bpmn-server's own checks (verifyModel's codes), or what bpmn-server runs as it is.
 */
const DESCRIPTIONS = {
    'ad-hoc-sub-process': 'An ad-hoc sub-process has no start or end events and no flows inside it.',
    'conditional-flows': 'When an element that is not a gateway has several outgoing flows, each has a condition.',
    'end-event-required': 'Every process and sub-process has an end event. Off: bpmn-server checks it (no-end-event).',
    'event-based-gateway': 'An event-based gateway is followed only by catching events or receive tasks.',
    'event-sub-process-typed-start-event': 'An event sub-process starts with a typed start event (timer, message, signal, error, ...).',
    'fake-join': 'A task with several incoming flows does not join them: each arrival runs it again. A gateway joins.',
    'global': 'Each message, signal, error and escalation has a name, one of each name, and is used by an element.',
    'label-required': 'Every element has a name. Off: the ids stand in for names.',
    'link-event': 'Link events come in pairs: each throwing link has a catching link of the same name.',
    'no-bpmndi': 'Every element is drawn in the diagram. Off: bpmn-server checks it (not-in-diagram).',
    'no-complex-gateway': 'Complex gateways are not used.',
    'no-disconnected': 'No element stands apart, without incoming and outgoing flows. Off: bpmn-server checks it (unreachable).',
    'no-duplicate-sequence-flows': 'No two flows connect the same two elements.',
    'no-gateway-join-fork': 'A gateway either joins or splits flows, not both. Off: bpmn-server runs such a gateway and warns (mixed-gateway).',
    'no-implicit-end': 'A path ends at an end event, not at an element without outgoing flows. Off: bpmn-server checks it (no-outgoing).',
    'no-implicit-split': 'Flows split at a gateway, not by several unconditional flows leaving a task.',
    'no-implicit-start': 'Every element but a start event has an incoming flow. Off: bpmn-server checks it (unreachable).',
    'no-inclusive-gateway': 'Inclusive gateways are not used. Off: bpmn-server runs them.',
    'no-overlapping-elements': 'Elements in the diagram do not overlap.',
    'single-blank-start-event': 'A process has at most one blank (untyped) start event.',
    'single-event-definition': 'An event has one definition at most (one timer, or one message, ...).',
    'start-event-required': 'Every process and sub-process has a start event. Off: bpmn-server checks it (no-start-event).',
    'sub-process-blank-start-event': 'A sub-process starts with a blank start event.',
    'superfluous-gateway': 'A gateway with one incoming and one outgoing flow does nothing: it can go.',
    'superfluous-label': 'A label adds something: a start or end event is not named like the flow next to it.',
    'superfluous-termination': 'A terminate end event is used only where another path could still be running.',
};

/** Every rule: its level as the editor ships it (bpmnlintrc.json over bpmnlint's recommended), what it checks, and its documentation. */
export function ruleDefaults() {
    return Object.keys(RULES).sort().map(name => ({
        name,
        level: config.rules[name] ?? recommended.rules[name] ?? 'off',
        url: RULES[name]().meta?.documentation?.url,
        description: DESCRIPTIONS[name] ?? ''
    }));
}

/**
 * The model's lint findings, as Problems lists issues: { severity, code: 'bpmnlint/<rule>', message, elementId, url }.
 * `overrides` are the team's changes ({ '<rule>': 'off' | 'info' | 'warn' | 'error' }, GET /model/lint-rules).
 */
export async function lint(definitions, overrides = {}) {
    if (!definitions)
        return [];
    const effective = { ...config, rules: { ...config.rules, ...overrides } };
    // a new linter each time: rules keep what they have seen (no-duplicate-sequence-flows), so one run each
    const results = await new Linter({ config: effective, resolver }).lint(definitions);
    return Object.entries(results).flatMap(([rule, reports]) => reports.map(report => ({
        severity: SEVERITY[report.category] || 'warning',
        code: `bpmnlint/${rule}`,
        message: report.message,
        elementId: report.id,
        url: report.meta?.documentation?.url
    })));
}
