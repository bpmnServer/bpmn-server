Feature: test_gateway1
  A parallel split into three tasks, an inclusive gateway whose second condition is false, and an exclusive branch;
  the parallel join waits for all of them.

  Scenario: Every branch done, the join goes on to Activity_3
    When @start process:test_gateway1 as :i
      And @invoke element:Activity_1 in :i
    Then @check :i has 0 items of element:Activity_2_4_2 with status "wait"
      And @check :i last element:Activity_2_4_1 status is "wait"
    When @invoke element:Activity_2_1 in :i
      And @invoke element:Activity_2_2 in :i
      And @invoke element:Activity_2_3 in :i
    Then @check :i has 0 items of element:Activity_3 with status "wait"
    When @invoke element:Activity_2_4_1 in :i
    Then @check :i last element:Activity_3 status is "wait"
    When @invoke element:Activity_3 in :i
      And @invoke element:Activity_4 in :i
    Then @check :i status is "end"
      And @check :i passed element:Event_0l04zdk
      And @check :i passed element:Event_1qptq2d
