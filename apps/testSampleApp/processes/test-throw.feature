Feature: test-throw
  Throws msg1 (which starts test-catch) and waits for confirm1; after a timer, throws msg2 and waits for confirm2.

  Scenario: Each confirmation in turn
    When @start process:test-throw as :i
      | caseId | 1001 |
    Then @check :i passed element:Event_1c2n6uf with status "end"
      And @check :i last element:Event_0a86ryr status is "wait"
    When @invoke element:Event_0a86ryr in :i
      And @invoke element:Event_0sdcy6p in :i
    Then @check :i passed element:Event_1p5nwvf with status "end"
    When @invoke element:Event_0mdlpc9 in :i
    Then @check :i status is "end"
