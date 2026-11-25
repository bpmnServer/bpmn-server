Feature: timerBeforeUser
  A task, a two-second timer, then a user task.

  Scenario: After the timer, the user task
    When @start process:timerBeforeUser as :i
    Then @check :i has 0 items of element:Activity_0aftsbf with status "wait"
    When @invoke element:Event_04w6u9w in :i
    Then @check :i last element:Activity_0aftsbf status is "wait"
    When @invoke element:Activity_0aftsbf in :i
    Then @check :i status is "end"
