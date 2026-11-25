Feature: ReceiveTask
  A receive task waits until it is invoked.

  Scenario: The receive task waits, then is received
    When @start process:ReceiveTask as :i
    Then @check :i last element:Activity_0plk674 status is "wait"
    When @invoke element:Activity_0plk674 in :i
    Then @check :i status is "end"
      And @check :i passed element:Event_07mfomy
