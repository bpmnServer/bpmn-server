Feature: t-catch-signals2
  Started by Signal-102: a script sets the client, then it waits for both Signal-103 and Message-104.

  Scenario: Both arrive
    When @start process:t-catch-signals2 as :i
    Then @check :i data.clientId is 101
      And @check :i last element:Event_0f5gkmt status is "wait"
      And @check :i last element:Event_1s5dbgp status is "wait"
    When @invoke element:Event_0f5gkmt in :i
    Then @check :i status is "running"
    When @invoke element:Event_1s5dbgp in :i
    Then @check :i status is "end"
