Feature: test-exclusive-gateway
  A service task, then three user tasks in parallel, merged by an exclusive gateway: the first done goes on.

  Scenario: UT2 done first: ST2 runs and the process ends
    When @start process:test-exclusive-gateway as :i
    Then @check :i passed element:Activity_1faqlgg with status "end"
    When @invoke element:Activity_02y07d5 in :i
    Then @check :i passed element:Activity_1fem76t with status "end"
      And @check :i status is "end"
