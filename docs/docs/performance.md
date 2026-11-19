# Performance and test coverage

This page gives the speed, load and memory figures from BPMN Server's own test suites, the effect of the database indexes, and how much of the code the tests run. Each section says when the figures were taken and how to take them again on your own machine.

The figures come from one developer machine, so use them as an order of magnitude, not a guarantee. On a shared machine, elapsed times vary by up to about 2× from one run to the next. That is why the suites check CPU time where they can.

**Measured** on 2026-11-17 at commit `7d404d9` (branch 3.7.1), on an Intel Core i9-13900H with 32 GB of memory, Windows 11, Node 24.14 and a local MongoDB 7.0.

## How to run the measurements

| Command | What it measures | Time |
| --- | --- | --- |
| `npm run test:load -w bpmn-server` | Speed, stress and memory, with limits that fail on a real regression. Uses the in-memory store by default. | ~2.5 min |
| `LOAD_MONGO_URL=mongodb://localhost:27017 npm run test:load -w bpmn-server` | The same suites on MongoDB, in the database `bpmn_load_test`, which is emptied first. | ~2 min |
| `LOAD_SCALE=10 npm run test:load -w bpmn-server` | The same, with every count multiplied by 10. | longer |
| `npm run bench -w bpmn-server` | A benchmark that prints figures and checks no limits. | ~20 s |
| `BPMN_TEST_MONGO_URL=mongodb://localhost:27017 node --test packages/bpmn-server/test/indexes.mongo.test.mjs` | Checks that the common queries use indexes on MongoDB, and prints their times. Add `LOAD_SCALE` for a larger database. | ~15 s |
| `npm run test:coverage` | Runs every suite with V8 coverage and writes `reports/coverage/summary.md`. | ~25 min |

The load suites are a manual job on CI: run **Tests** from the Actions tab (`workflow_dispatch`). They don't run on pull requests. The index test runs on every pull request, because the test job has a MongoDB service.

## Speed of one process

The CPU time and the elapsed time of a whole process, from its start to its end, averaged over 50 runs (the median of 5 rounds).

| Process | In-memory store | MongoDB |
| --- | --- | --- |
| Expense: a start event, then 2 user tasks | 17 ms (18 ms CPU) | 29 ms (19 ms CPU) |
| Claim: a service task, a gateway, a user task and a message | 33 ms (31 ms CPU) | 33 ms (19 ms CPU) |
| Loading a model (reading and parsing the file) | 4.7 ms (2.0 ms CPU) | 1.6 ms (0.9 ms CPU) |

The limits the suite checks are 40 ms of CPU per process in memory and 80 ms on MongoDB, well above today's figures, so that only a real regression fails the test.

The benchmark (`npm run bench`), which runs the expense process without the load suite's extra checks, measured 5.9 ms per process in memory (169 processes per second, one at a time).

## Under load

Expense processes run with more and more of them at the same time, on one server:

| At the same time | In memory: processes per second | Latency, median / 95th percentile | MongoDB: processes per second | Latency, median / 95th percentile |
| ---: | ---: | ---: | ---: | ---: |
| 1 | 91 | 10 / 16 ms | 36 | 22 / 55 ms |
| 10 | 131 | 75 / 101 ms | 98 | 98 / 148 ms |
| 50 | 130 | 378 / 413 ms | 90 | 530 / 709 ms |
| 200 | 126 | 1,489 / 1,613 ms | 92 | 2,098 / 2,143 ms |

Throughput levels off at about 130 processes per second in memory and about 95 on MongoDB, because one Node process runs one JavaScript thread. Beyond that, more requests at once wait longer, but none are lost, and throughput doesn't drop. To go beyond one process, run several servers on one database. The stress suite checks that they take turns on the same instances.

The stress suite also checks the following:

- Hundreds of processes started at once each keep their own data.
- When many requests try to complete the same task at once, exactly one goes through.
- Service tasks waiting on I/O overlap across instances instead of queueing: 50 claims, each with a service that waits 20 ms, took 559 ms in all, with up to 50 waiting together.
- No lock is left behind.

## Memory

The heap of the server's Node process. On the in-memory store, the instances themselves are in that heap too.

| Measure | In-memory store | MongoDB |
| --- | --- | --- |
| A waiting instance, without the cache | 28 KB | 0.5 KB (the instance is in the database) |
| A waiting instance, in the cache | 48 KB | 49 KB |
| 2,000 processes run, then deleted | 22 MB, then 178 MB, then back to 20 MB | 24.5 MB, then back to 22.9 MB |
| 20 servers started, used and shut down | 20.3 MB, then 20.6 MB | 23.9 MB, then 23.7 MB |
| 500 claims at once | peak 248 MB; 22 MB afterwards | peak 344 MB; 24 MB afterwards |

In every case, the heap returns to where it started: nothing is left behind.

An instance's stored document is about 16 KB for the expense process, or 3 KB when its log isn't saved (`saveLogs` off on the data store).

## Large databases: indexes

Instances stay in the database after they end, unless they're archived, so queries for the work that's still waiting read through more and more ended instances over time. On MongoDB, setup creates indexes for the queries that task lists and dashboards send. [Data and Persistence](data.md#indexes) lists them. Without these indexes, each of those queries reads every instance.

Measured with 50,000 ended instances and 1,000 waiting, on MongoDB:

| Query | Without the indexes | With them |
| --- | ---: | ---: |
| The waiting items of an element | 406 ms | 35 ms |
| The task list, as an administrator | 292 ms | 32 ms |
| The task list, as a user (the security conditions added) | 1,102 ms | 34 ms |
| A process's running instances | 227 ms | 52 ms |
| The count of waiting instances (dashboard) | 332 ms | 3 ms |
| The count of running instances (dashboard) | 82 ms | 2 ms |
| Instances read, for each query | 51,000 | 1,000 |

The indexes made no measurable difference to the speed of writes: the difference was smaller than the variation from one run to the next.

On MongoDB, a process takes the same time with 5,000 more instances stored (21 ms against 22 ms). The **in-memory store** has no indexes. Each query checks every instance, so with 5,000 more instances stored a process takes 66 ms instead of 19 ms. The store is meant for tests and small embedded use. **SQLite** narrows queries by plain equalities, but it doesn't index fields inside `items`.

## Security policies

A security policy is asked once for each case a list shows, and once for each task the task list shows. Measured by
`test/load/security.test.mjs` (in `npm run test:load`), on Windows, Node.js 24, on 2026-11-19:

| What a case's check costs | Per case | A page of 50 cases |
| --- | ---: | ---: |
| The built-in default | 0.14 ms | 7 ms |
| A decision table of 3 rules | 0.59 ms | 29 ms |
| An application's `decisionContext` hook that waits 5 ms, one case at a time | 15.6 ms | 780 ms |
| The same hook, 16 cases at a time, as the lists ask them | 1.3 ms | 65 ms |

- **A policy table is cheap.** Its file is read and parsed once, until it changes.
- **What costs is a hook that waits.** An application whose `decisionContext` asks another system pays that wait for
  every case. The lists decide 16 cases at once (`CaseAccess.decideAll`), and the task list stops once its page is full.
  (The wait above is 15 ms on Windows, whose timers are coarser than the 5 ms asked.) Keep the hook fast, or cache what
  it reads.
- **Narrowed in the database:** a list's query reads only the cases the policy's `see` rules could show the user
  (who started it, is assigned, is offered it, did a step), then asks the policy for each. A policy whose rules may
  show any case (one testing only the data, say) isn't narrowed.

## Limits and what isn't measured

- The load suites measure the engine directly. There is no load test of the web layer yet: the REST API and the pages under many concurrent users.
- A query on your own fields, such as `data.caseId`, reads every instance. On a large database, add an index for it in MongoDB.
- The figures for MongoDB are on a local database. A database across a network adds its round trips to every step.

## Test coverage

Lines, functions and branches that ran during the tests. Covered code ran during a test, but that doesn't prove a test checked its result. `npm run test:coverage` writes the full summary to `reports/coverage/summary.md`, and a browsable report to `coverage/`. CI runs it on every pull request and keeps the report as an artifact. The run fails when bpmn-server falls below 90% of its lines, functions or branches.

Measured by CI, on Linux, on 2026-11-17 at commit `c460297` (`main`):

| Package | Files | Lines | Functions | Branches |
| --- | ---: | ---: | ---: | ---: |
| bpmn-server | 93 | 95.7% | 91.9% | 90.1% |
| bpmn-web | 76 | 83.2% | 90.2% | 81.1% |
| bpmn-client | 17 | 52.1% | 82.0% | 79.8% |
| bpmn-mcp | 2 | 100% | 100% | 91.1% |

Measure on Linux, as CI does. On Windows, some modules are loaded twice under two spellings of the drive (`c:\` and `C:\`), and merging the processes' data then loses counts: a Windows run reports less than was tested.

The modeler's browser code is not measured: it runs in the browser during the UI tests. Most of bpmn-client's untested lines are its command line, remote import and monitor, which the tests don't run.

**Scenario coverage** is what each model's saved scenarios reach, by the same rules as the Test tab: an element counts when a scenario that passed reached it. In the test app, measured on 2026-11-17 (branch 3.7.1), 76 of its 99 models have saved scenarios, 115 in all. They reach 99.3% of those models' nodes and 96.5% of their flows. One fails there: GitHub repository's, which calls GitHub itself. Most of the models without scenarios reproduce reported issues or test the engine, and have their own tests in the issues and engine suites.

[Features](features.md) lists every feature with the tests that cover it.
