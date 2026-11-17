Feature: t-catch-signals1
  Started by Signal-102 (as t-throw-signals throws it): a script, then it waits for Signal-103.

  Scenario: Signal-103 arrives
    When @start process:t-catch-signals1 as :i
    Then @check :i data.signal is "signal-102"
      And @check :i last element:Event_0f5gkmt status is "wait"
    When @invoke element:Event_0f5gkmt in :i
    Then @check :i status is "end"
