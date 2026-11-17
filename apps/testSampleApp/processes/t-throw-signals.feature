Feature: t-throw-signals
  Throws Signal-101 and Signal-102 (which start t-catch-signals1 and 2), waits five seconds, then throws Signal-103,
  Message-104 and Message-105.

  Scenario: Both signals thrown; after the wait, the rest
    When @start process:t-throw-signals as :i
    Then @check :i passed element:Event_190dv7t with status "end"
      And @check :i passed element:Event_097goil with status "end"
      And @check :i last element:Event_1cb4pzi status is "wait"
    When @invoke element:Event_1cb4pzi in :i
    Then @check :i passed element:Event_07suegq with status "end"
      And @check :i passed element:Event_029t7ee with status "end"
      And @check :i status is "end"
