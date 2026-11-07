Feature: test_gateway3

  Scenario: gateway3.js
    When @start process:test_gateway3 as :i
      | reminderCounter | 0 |
      | caseId | 9213 |
    And @invoke element:task_Buy in :i
      | needsCleaning | "Yes" |
      | needsRepairs | "Yes" |
    And @check :i element:task_repair status is "wait"
    And @check :i element:task_clean status is "wait"
    And @check :i element:Get_Ready status is "wait"
    And @invoke element:task_clean in :i
    And @check :i element:task_repair status is "wait"
    And @check :i element:Get_Ready status is "wait"
    And @check :i element:Buy_Supplies status is "wait"
    And @check :i element:gateway_2 status is "wait"
    And @check :i element:task_clean status is "end"
    And @invoke element:task_repair in :i
    And @check :i element:task_repair status is "end"
    And @check :i element:task_clean status is "end"
    And @check :i element:gateway_2 status is "end"
    And @check :i element:Get_Ready status is "wait"
    And @check :i element:task_Drive status is "wait"
    And @invoke element:task_Drive in :i
    And @check :i element:task_repair status is "end"
    And @check :i element:task_clean status is "end"
    And @check :i element:gateway_2 status is "end"
    And @check :i element:task_Drive status is "end"
    And @check :i element:Get_Ready status is "wait"
