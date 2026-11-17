Feature: timer-expression
  A user task with a reminder timer whose delay a service works out (getTimerDelay); the reminder does not interrupt.

  Scenario: The task done
    When @start process:timer-expression as :i
    Then @check :i last element:Event_0hx26qc status is "wait"
    When @invoke element:Activity_0cijuru in :i
    Then @check :i status is "end"
      And @check :i has 0 items of element:Activity_1sb18f9 with status "end"

  Scenario: The reminder fires; the task still waits
    When @start process:timer-expression as :i
      And @invoke element:Event_0hx26qc in :i
    Then @check :i passed element:Activity_1sb18f9 with status "end"
      And @check :i last element:Activity_0cijuru status is "wait"
