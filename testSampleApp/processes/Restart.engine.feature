Feature: Restart

  Scenario: restart2.js
    When user:user1 @login
    And @start process:Restart as :i
      | caseId | 9511 |
    And @invoke element:task1 in :i
    And @invoke element:task2 in :i
    And @check :i data.caseId is 9511
    And @check :i status is "end"
    And @check :i endedAt is not null
    And @check :i element:task2 status is "end"
    And @startEvent element:start2 in :i restart
    And @check :i data.caseId is 9511
    And @check :i status is "running"
    And @check :i endedAt is null
    And @check :i last element:task1 status is "wait"
