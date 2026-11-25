Feature: test-boundary-timer
  UT1, a service, then RT1 with a 15-second timer on it: done in time, or the timer moves it on; UT2 either way.

  Scenario: RT1 done in time
    When @start process:test-boundary-timer as :i
      And @invoke element:UT1 in :i
    Then @check :i passed element:Activity_1wqv90b with status "end"
      And @check :i last element:Activity_1pah88b status is "wait"
    When @invoke element:Activity_1pah88b in :i
      And @invoke element:UT2 in :i
    Then @check :i status is "end"

  Scenario: The timer first: RT1 is cancelled
    When @start process:test-boundary-timer as :i
      And @invoke element:UT1 in :i
      And @invoke element:Event_wait1 in :i
    Then @check :i has 0 items of element:Activity_1pah88b with status "wait"
      And @check :i last element:UT2 status is "wait"
