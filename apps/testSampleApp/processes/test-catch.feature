Feature: test-catch
  Started by msg1: after a timer, throws confirm1, waits for msg2, and after another timer ends throwing confirm2.

  Scenario: The timers and msg2, then the end
    When @start process:test-catch as :i
      | caseId | 1002 |
    Then @check :i last element:Event_1jxticj status is "wait"
    When @invoke element:Event_1jxticj in :i
    Then @check :i passed element:Event_1d1ctka with status "end"
      And @check :i last element:Event_0m0xe67 status is "wait"
    When @invoke element:Event_0m0xe67 in :i
      And @invoke element:Event_1o4h7vy in :i
    Then @check :i status is "end"
      And @check :i passed element:Event_0rb320g
