Feature: test_gateway2
  A parallel split into a task and a subprocess with an inclusive split and join of its own.

  Scenario: The task and both of the subprocess's tasks, then Activity_3
    When @start process:test_gateway2 as :i
      And @invoke element:Activity_1 in :i
      And @invoke element:Activity_2_1 in :i
      And @invoke element:Activity_2_4_1 in :i
    Then @check :i has 0 items of element:Activity_3 with status "wait"
    When @invoke element:Activity_2_4_2 in :i
    Then @check :i passed element:Sub-process with status "end"
    When @invoke element:Activity_3 in :i
    Then @check :i status is "end"
