Feature: test_gateway3
  Buy, then an inclusive gateway: clean, repair, or neither (its default); the second pool, Get Ready, runs beside it.

  Scenario: Neither cleaning nor repairs: the default way to Drive
    When @start process:test_gateway3 as :i
      And @invoke element:task_Buy in :i
      | needsRepairs  | "No" |
      | needsCleaning | "No" |
    Then @check :i has 0 items of element:task_clean with status "wait"
      And @check :i has 0 items of element:task_repair with status "wait"
    When @invoke element:Get_Ready in :i
      And @invoke element:task_Drive in :i
    Then @check :i status is "end"
      And @check :i passed element:Event_0xmjdgl

  Scenario: Repairs only
    When @start process:test_gateway3 as :i
      And @invoke element:task_Buy in :i
      | needsRepairs  | "Yes" |
      | needsCleaning | "No" |
    Then @check :i has 0 items of element:task_clean with status "wait"
    When @invoke element:task_repair in :i
    Then @check :i last element:task_Drive status is "wait"
