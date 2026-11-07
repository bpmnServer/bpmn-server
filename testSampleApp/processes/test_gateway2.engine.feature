Feature: test_gateway2

  Scenario: gateway2.js
    When @start process:test_gateway2 as :i
      | reminderCounter | 0 |
      | caseId | 9212 |
    And @invoke element:Activity_1 in :i
    And @check :i element:Activity_2_1 status is "wait"
    And @check :i element:Activity_2_4_1 status is "wait"
    And @check :i element:Activity_2_4_2 status is "wait"
    And @check :i element:Sub-process status is "wait"
    And @invoke element:Activity_2_4_1 in :i
    And @invoke element:Activity_2_4_2 in :i
    And @check :i element:Gateway_4 status is "wait"
    And @invoke element:Activity_2_1 in :i
    And @check :i element:Activity_3 status is "wait"
    And @invoke element:Activity_3 in :i
    And @check :i element:Activity_3 status is "end"
