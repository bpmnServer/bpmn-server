Feature: timer2
  A timer on a cron expression.

  Scenario: The timer waits, then fires
    When @start process:timer2 as :i
    Then @check :i last element:Event_0nhgjxv status is "wait"
    When @invoke element:Event_0nhgjxv in :i
    Then @check :i status is "end"
