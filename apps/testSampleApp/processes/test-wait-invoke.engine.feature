Feature: test-wait-invoke

  Scenario: without noWait (noWait.js)
    When @start process:test-wait-invoke as :i
      | reminderCounter | 0 |
      | caseId | 9501 |
    And user:user1 @login with role of "Employee"
    And @invoke element:Activity_0z113lq in :i
    And @check :i element:StartEvent_1 status is "end"
    And @check :i element:Activity_0z113lq status is "end"
    And @check :i has 9 items with status "end"

  Scenario: with noWait (noWait.js)
    When @start process:test-wait-invoke as :i
      | reminderCounter | 0 |
      | caseId | 9501 |
    And user:user1 @login with role of "Employee"
    And @invoke element:Activity_0z113lq in :i no wait
    And @check :i element:StartEvent_1 status is "end"
    And @check :i element:Activity_0z113lq status is "end"
    And @check :i has 3 items with status "end"
