Feature: MsgCatch
  Started by a message, it throws confirm1, waits for msg2, and ends throwing confirm2.

  Scenario: Waits for msg2, then ends
    When @start process:MsgCatch as :i
    Then @check :i passed element:throw_confirm1 with status "end"
      And @check :i last element:catch_msg2 status is "wait"
    When @invoke element:catch_msg2 in :i
    Then @check :i status is "end"
      And @check :i passed element:EndEvent_05lvru6
