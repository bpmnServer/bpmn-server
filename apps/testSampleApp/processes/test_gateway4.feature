Feature: test_gateway4
  Two reviews in parallel, each with a one-minute timer, merged by an exclusive gateway: the first to arrive goes on.

  Scenario: R1 done first goes on to the next task
    When @start process:test_gateway4 as :i
    Then @check :i last element:R1 status is "wait"
      And @check :i last element:R2 status is "wait"
    When @invoke element:R1 in :i
      And @invoke element:Activity_0prnt3u in :i
    Then @check :i status is "end"
      And @check :i passed element:Event_12xbecf
