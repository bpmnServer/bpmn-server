Feature: msgThrow
  Throws msg1 (which starts MsgCatch), waits for confirm1, throws msg2, and waits for confirm2.

  Scenario: Each confirmation it waits for, in turn
    When @start process:msgThrow as :i
    Then @check :i passed element:throw_msg1 with status "end"
      And @check :i last element:catch_confirm1 status is "wait"
    When @invoke element:catch_confirm1 in :i
    Then @check :i passed element:event_throw_msg2 with status "end"
      And @check :i last element:event_catch_confirm2 status is "wait"
    When @invoke element:event_catch_confirm2 in :i
    Then @check :i status is "end"
