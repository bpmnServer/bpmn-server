Feature: timer-repeat
  A user task with a reminder every second, three times, that does not interrupt it.

  Scenario: A reminder, then the task done
    When @start process:timer-repeat as :i
      And @invoke element:Event_13eeake in :i
    Then @check :i passed element:Activity_00qabv3 with status "end"
      And @check :i last element:Activity_1fpjmlq status is "wait"
    When @invoke element:Activity_1fpjmlq in :i
    Then @check :i status is "end"
