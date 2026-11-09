Feature: test-boundary-timer

  Scenario: the timer starts the next task (boundaryEvent2.js)
    When @start process:test-boundary-timer as :i
      | caseId | 9403 |
    And @check :i element:UT1 status is "wait"
    And @invoke element:UT1 in :i
    And @wait :i element:UT2 status is "wait" within 40 seconds
    And @check :i element:UT1 status is "end"
