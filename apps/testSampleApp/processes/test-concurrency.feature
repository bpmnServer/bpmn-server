Feature: test-concurrency
  A long and a short branch, each a user task then service1 (a long and a short wait); a STOP signal beside them
  ends everything.

  Scenario: Both branches done
    Given @stub service:service1 with
      """javascript
      return { text: 'stubbed' };
      """
    When @start process:test-concurrency as :i
      And @invoke element:UserShort in :i
      And @invoke element:UserLong in :i
    Then @check :i passed element:Event_0ofhk6b
      And @check :i last element:Event_1ksidd8 status is "wait"

  Scenario: STOP ends the process
    When @start process:test-concurrency as :i
      And @invoke element:Event_1ksidd8 in :i
    Then @check :i passed element:Event_0ln5o7o
      And @check :i has 0 items of element:UserLong with status "wait"
      And @check :i status is "end"
