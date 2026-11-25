Feature: timer-sample
  The start keeps its two inputs, a script adds them, and a two-second timer ends it.

  Scenario: The inputs added, then the timer
    When @start process:timer-sample as :i
      | input1 | 2 |
      | input2 | 3 |
    Then @check :i data.var3 is 5
      And @check :i last element:Event_timer status is "wait"
    When @invoke element:Event_timer in :i
    Then @check :i status is "end"
