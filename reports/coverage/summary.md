# Test coverage

Written by `npm run test:coverage`: 2026-11-17T13:20:14.716Z, at commit 7d404d9. Tested lines ran during the tests; that does not say the tests checked them.

## The code

The server side of each package, from all the suites. The editor's browser code is not measured. The browsable report is in `coverage/` after a run.

| Package | Files | Lines | Functions | Branches |
| --- | ---: | ---: | ---: | ---: |
| bpmn-client | 17 | 52.1% | 82% | 79.9% |
| bpmn-mcp | 2 | 100% | 100% | 91.1% |
| bpmn-server | 100 | 90.8% | 85.9% | 82.3% |
| bpmn-web | 81 | 75.7% | 82.6% | 76.2% |

## The scenarios

What each model's saved scenarios reach, by the Test tab's rules: an element counts when a scenario that passed reached it. 23 of 99 models have scenarios.

| Model | Scenarios | Failed | Nodes | Flows | Not covered |
| --- | ---: | ---: | ---: | ---: | --- |
| Buy Used Car | 4 | 0 | 8 of 8 | 9 of 9 |  |
| Buy Used Car with Lanes | 3 | 0 | 8 of 8 | 9 of 9 |  |
| CallTask | 1 | 0 | 2 of 4 | 1 of 3 | Activity_1g1uoam, Event_1wxl4bq, Flow_0irf9tz, Flow_0qasnf8 |
| Cash Request | 2 | 0 | 7 of 7 | 6 of 6 |  |
| Error events | 8 | 0 | 28 of 28 | 22 of 22 |  |
| Event Based Gateway | 2 | 0 | 8 of 8 | 8 of 8 |  |
| Flight Distruption | 2 | 0 | 13 of 13 | 14 of 14 |  |
| GitHub repository | 1 | 1 | 0 of 5 | 0 of 3 | Asked, GetRepo, NoSuchRepo, Done, NotFound, toGet, toDone, toNotFound |
| Hungry | 2 | 0 | 9 of 9 | 9 of 9 |  |
| Invoice | 7 | 1 | 13 of 13 | 12 of 12 |  |
| Leave Application | 1 | 0 | 6 of 9 | 5 of 8 | Event_02om8ew, Activity_1escddn, timer-event, Flow_1ef1q1u, Flow_0rvg1ym, Flow_00etx8n |
| Multi-Approval | 2 | 2 | 0 of 20 | 0 of 21 | StartEvent_1, Activity_1lg7box, Event_0xgks6j, Activity_0c3e5km, Event_1okfyie, Event_1wyu33h, Activity_19dwlw0, Activity_1933u7m, Activity_0kwhbk9, Gateway_0jvx355, Gateway_04swq36, Gateway_0mhsdzq, Gateway_000w0l0, Activity_0gti5wn, Activity_1i7eqt9, Activity_0eimdk4, Event_0u3u3xv, Activity_01735pj, Activity_0wk3rin, Event_0pw9ww4, Flow_0bqvsa8, Flow_1hozf68, Flow_1ceebqu, Flow_1go9te0, Flow_1sq88vb, Flow_0a9wf0h, Flow_03g004f, Flow_0x0gkkz, Flow_0vmdi4t, Flow_0jefexl, Flow_0e3n50k, Flow_0kqcowx, Flow_09r3p19, Flow_0vaays7, Flow_0epaz0e, Flow_1ywlhpz, Flow_09is5g6, Flow_1d6gfix, Flow_04xtu14, Flow_1hfhbki, Flow_1g27o2b |
| Property Insurance Claim | 1 | 0 | 5 of 9 | 4 of 8 | Task_AssessClaim, Event_PaymentConfirmed, Task_MarkSettled, EndEvent_Settled, Flow_Covered_Assign, Flow_Assess_PaymentWait, Flow_Payment_Settle, Flow_Settle_End |
| Restart | 2 | 0 | 6 of 6 | 4 of 4 |  |
| ad hoc | 1 | 0 | 11 of 12 | 6 of 7 | Event_1j3vle5, Flow_0y00zms |
| boundary-event | 1 | 0 | 6 of 10 | 4 of 9 | Reminder-Timer, Cancel-Message, process_request, task_2, flow_user_receive, flow_receive_end, Flow_0a5dhlj, Flow_17ss8eo, Flow_0ep8gow |
| employee-onboarding | 2 | 0 | 11 of 15 | 11 of 16 | enrol-leadership, grant-dev-tools, dev-ready, manager-ready, Flow_provision-accounts_provisioned, Flow_role-extras_grant-dev-tools, Flow_role-extras_enrol-leadership, Flow_grant-dev-tools_dev-ready, Flow_enrol-leadership_manager-ready |
| failing listener | 1 | 1 | 0 of 2 | 0 of 1 | start, end, Flow_1 |
| hello | 1 | 0 | 4 of 4 | 3 of 3 |  |
| loop 2 | 1 | 0 | 7 of 7 | 8 of 8 |  |
| loop1 | 1 | 1 | 0 of 9 | 0 of 6 | StartEvent_1, Event_09xuxyt, Activity_0mzmj08, Event_143uaru, Event_0ygnxva, Activity_18dzrjx, Event_0j6hydw, Event_08wtvbc, Activity_1qe2z25, Flow_10t4k8w, Flow_0z980hn, Flow_0aw9d19, Flow_1h9kmw7, Flow_1qv6q76, Flow_1wv8m8i |
| loop2 | 1 | 0 | 6 of 6 | 4 of 4 |  |
| test-onboarding | 1 | 0 | 9 of 10 | 9 of 10 | onboardingRejected, Flow_reject_end |

### Scenarios that failed

- **GitHub repository**, Scenario 1: Starting failed: No connector 'github'
- **Invoice**, Paid in Full: Cannot read properties of undefined (reading 'remove')
- **Multi-Approval**, Path to B: Cannot read properties of undefined (reading 'remove')
- **Multi-Approval**, Path to Flow: Treasury → Gateway_04swq36: Cannot read properties of undefined (reading 'remove')
- **failing listener**, a failing process listener fails the start: Cannot read properties of undefined (reading 'remove')
- **loop1**, nested loops key their items outer.inner: Cannot read properties of undefined (reading 'remove')

Models with no scenarios: Business Rules, BusinessRules, Buy Used Car-engine-test, Complex Approval Process, Issue 196, Issue 233, Issue 245, Issue124-1, Issue124-1A, Issue124.bpmn, Issue186, Issue186A, Issue193.bpmn.txt, Issue197, Issue197A.txt, Leave Application2, Long Running Process, MsgCatch, Multi-level-Approval, ReceiveTask, Signal, Signal.bpmn, Standard Loop, SubProcess, SubProcess-engine-test, Trans, UT, UserInputDataObject, Users Vote, WebService, boundary-event-engine-test, buy-used-car, leave-request, loop, loop-engine-test, messageFlow, msgThrow, multi-inst, multi-inst.bpmn, multi-instanceErr, multiStart, pizza store example, scripts and services, sendTask, serviceTask, simple, t-catch-signals1, t-catch-signals2, t-throw-signals, test escalation level, test-boundary-timer, test-catch, test-catch2, test-concurrency, test-escalation, test-escalation2, test-exclusive-gateway, test-import, test-service, test-service-input, test-system-crash, test-throw, test-throw2, test-wait-invoke, test_gateway1, test_gateway2, test_gateway3, test_gateway4, test_gateway5, timer-expression, timer-repeat, timer-sample, timer1, timer2, timerBeforeUser, track-claim.bpmn.
