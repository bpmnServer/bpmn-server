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

/** Every rule: its level as the editor ships it (bpmnlintrc.json over bpmnlint's recommended), and its documentation. */
export function ruleDefaults() {
    return Object.keys(RULES).sort().map(name => ({
        name,
        level: config.rules[name] ?? recommended.rules[name] ?? 'off',
        url: RULES[name]().meta?.documentation?.url
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
