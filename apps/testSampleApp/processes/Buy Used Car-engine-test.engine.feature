# carAccess.js was skipped too. Its last checks (definition.accessRules, authorizations, involvements, assignments, notifications) read what a test does not see.
Feature: Buy Used Car-engine-test

  Scenario: clean and repair (car.js)
    When user:user1 @login
    And @start process:"Buy Used Car-engine-test" as :i
      | caseId | 9101 |
    And @check :i data.starterUserId is "user1"
    And @check :i data.caseId is 9101
    And @check :i element:task_Buy status is "wait"
    And @find element:task_Buy in :i as :buy
      | item.status | "wait" |
    And @assign :buy
      | assignee | "user1" |
      | candidateUsers | ["employee1", "manager1"] |
      | priority | 7 |
    And @check :buy priority is 7
    And @invoke :buy
      | needsCleaning | "Yes" |
      | needsRepairs | "Yes" |
    And @check :i id is ${instance.id}
    And @check :i element:task_Buy status is "end"
    And @invoke element:task_clean in :i
    And @check :i element:task_clean status is "end"
    And @invoke element:task_repair in :i
    And @invoke element:task_Drive in :i
    And @check :i status is "end"
    And @check :i element:task_Drive status is "end"

  @skip
  Scenario: access rules (carAccess.js)
    When @start process:"Buy Used Car-engine-test" as :i
      | caseId | 9102 |
    And @check :i data.caseId is 9102
    And @check :i element:task_Buy status is "wait"
    And @invoke element:task_Buy in :i
      | needsCleaning | "Yes" |
      | needsRepairs | "Yes" |
    And @check :i element:task_Buy status is "end"
    And @invoke element:task_clean in :i
    And @invoke element:task_repair in :i
    And @invoke element:task_Drive in :i
    And @check :i status is "end"
    And @check :i element:task_Drive status is "end"

  Scenario: clean and repair, one after another (concurrent.js)
    When user:user1 @login
    And @start process:"Buy Used Car-engine-test" as :i
      | caseId | 9103 |
    And @check :i data.starterUserId is "user1"
    And @check :i data.caseId is 9103
    And @check :i element:task_Buy status is "wait"
    And @invoke element:task_Buy in :i
      | needsCleaning | "Yes" |
      | needsRepairs | "Yes" |
    And @check :i element:task_Buy status is "end"
    And @invoke element:task_clean in :i
    And @invoke element:task_repair in :i
    And @invoke element:task_Drive in :i
    And @check :i status is "end"
    And @check :i element:task_Drive status is "end"

  Scenario: find items (ds.js)
    When @start process:"Buy Used Car-engine-test" as :i
      | caseId | 9104 |
    And @find element:task_Buy in :i as :buy
      | item.status | "wait" |
    And @check items 1
      | items.id | ${item.id} |
    And @check items 1
      | id | ${instance.id} |
      | items.elementId | "task_Buy" |
    And @check items 1
      | data.caseId | 9104 |
      | items.elementId | "task_Buy" |
    And @check items 1
      | id | ${instance.id} |
      | items.status | "wait" |

  Scenario: find instances (ds.js)
    When @start process:"Buy Used Car-engine-test" as :i
      | caseId | 9105 |
    And @find element:task_Buy in :i as :buy
      | item.status | "wait" |
    And @check instances 1
      | id | ${instance.id} |
    And @check instances 1
      | items.id | ${item.id} |
    And @check instances 1
      | data.caseId | 9105 |

  Scenario: restart a finished instance (restart1.js)
    When user:user1 @login
    And @start process:"Buy Used Car-engine-test" as :i
      | caseId | 9106 |
    And @invoke element:task_Buy in :i
      | needsCleaning | "No" |
      | needsRepairs | "No" |
    And @invoke element:task_Drive in :i
    And @check :i data.caseId is 9106
    And @check :i status is "end"
    And @check :i endedAt is not null
    And @check :i element:task_Drive status is "end"
    And @find element:task_Buy in :i as :buy
      | item.status | "end" |
    And @restart :buy
    And @check :i data.caseId is 9106
    And @check :i status is "running"
    And @check :i endedAt is null
    And @check :i last element:task_Buy status is "wait"
