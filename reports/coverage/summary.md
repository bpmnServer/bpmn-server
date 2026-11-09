# Test coverage

Written by `npm run test:coverage`: 2026-11-06T19:45:23.356Z, at commit 93fde30. Tested lines ran during the tests; that does not say the tests checked them.

## The code

The server side of each package, from all the suites. The editor's browser code is not measured. The browsable report is in `coverage/` after a run.

| Package | Files | Lines | Functions | Branches |
| --- | ---: | ---: | ---: | ---: |
| bpmn-client | 16 | 44.1% | 85.2% | 74.5% |
| bpmn-mcp | 2 | 100% | 100% | 91.1% |
| bpmn-server | 87 | 95.6% | 91.9% | 90.6% |
| bpmn-web | 53 | 76.9% | 85.1% | 78.5% |

## The scenarios

What each model's saved scenarios reach, by the Test tab's rules: an element counts when a scenario that passed reached it. 10 of 58 models have scenarios.

| Model | Scenarios | Failed | Nodes | Flows | Not covered |
| --- | ---: | ---: | ---: | ---: | --- |
| Buy Used Car | 4 | 0 | 8 of 8 | 9 of 9 |  |
| Cancel Application | 2 | 0 | 12 of 12 | 12 of 12 |  |
| Cash Request | 2 | 0 | 7 of 7 | 6 of 6 |  |
| Error events | 8 | 0 | 28 of 28 | 22 of 22 |  |
| GitHub repository | 1 | 1 | 0 of 6 | 0 of 4 | Asked, GetRepo, NoSuchRepo, Done, NotFound, test1, toGet, toDone, toNotFound, Flow_0n1y7b6 |
| Invoice | 5 | 0 | 12 of 13 | 11 of 12 | EndEvent_0sxnxfz, SequenceFlow_1ml8g8q |
| Leave Application | 3 | 0 | 9 of 9 | 8 of 8 |  |
| boundary-event | 1 | 0 | 6 of 10 | 4 of 9 | Reminder-Timer, Cancel-Message, process_request, task_2, flow_user_receive, flow_receive_end, Flow_0a5dhlj, Flow_17ss8eo, Flow_0ep8gow |
| employee-onboarding | 5 | 0 | 15 of 15 | 16 of 16 |  |
| test-onboarding | 1 | 0 | 9 of 10 | 9 of 10 | onboardingRejected, Flow_reject_end |

### Scenarios that failed

- **GitHub repository**, Scenario 1: Starting failed: No connector 'github'

Models with no scenarios: ApprovalDynamic, Business Rules, BusinessRules, Complex Approval Process, Event Based Gateway, Flight Distruption, Hungry, Invoice v1, Invoice v2, MsgCatch, Multi-Approval, Multi-level-Approval, Property Insurance Claim, ReceiveTask, Restart, Signal, Standard Loop, SubProcess, Trans, UserInputDataObject, Users Vote, ad hoc, loop, loop 2, loop1, loop2, messageFlow, msgThrow, multi-inst, multi-inst.bpmn, multi-instanceErr, multi-vote-err, multiStart, pizza store example, sample, scripts and services, sendTask, serviceTask, simple, t-throw-signals, test-escalation, timer-expression, timer-repeat, timer-sample, timer1, timer2, timerBeforeUser, track-claim.bpmn.
