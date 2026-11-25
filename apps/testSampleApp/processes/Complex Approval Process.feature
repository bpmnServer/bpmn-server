Feature: Complex Approval Process
  Approvals in stages. Exclusive merges let the first branch to arrive go on and cancel the others, multi-instance
  approvals among them (Finance; Compliance); parallel joins wait for every approver.

  Scenario: The executive first, then risk, the treasury head, and every final approver
    When @start process:"Complex Approval Process" as :i
    Then @check :i has 2 items of element:Activity_1gw4tt4 with status "wait"
    When @invoke element:Activity_1f1t7or in :i
    Then @check :i has 0 items of element:Activity_1gw4tt4 with status "wait"
      And @check :i has 0 items of element:Activity_18z97oo with status "wait"
      And @check :i has 2 items of element:Activity_1pheg12 with status "wait"
      And @check :i has 2 items of element:Activity_1wcmz0j with status "wait"
    When @invoke element:Activity_1pheg12 key "0" in :i
      And @invoke element:Activity_1pheg12 key "1" in :i
    Then @check :i has 0 items of element:Activity_1wcmz0j with status "wait"
    When @invoke element:Activity_1btxjnj in :i
    Then @check :i has 0 items of element:Activity_00kn6ul with status "wait"
    When @invoke element:Activity_09gvlul in :i
      And @invoke element:Activity_0cx8t07 key "0" in :i
      And @invoke element:Activity_0cx8t07 key "1" in :i
      And @invoke element:Activity_0x3fp27 key "0" in :i
      And @invoke element:Activity_0x3fp27 key "1" in :i
    Then @check :i has 0 items of element:Activity_0uvbs3x with status "wait"
    When @invoke element:Activity_0x3fp27 key "2" in :i
      And @invoke element:Activity_0uvbs3x in :i
      And @invoke element:Activity_0vxl1xh in :i
      And @invoke element:Activity_0kvr74a in :i
    Then @check :i status is "end"
      And @check :i passed element:Event_0o32i9l

  Scenario: Finance's two approvals first: the other first-stage branches are cancelled
    When @start process:"Complex Approval Process" as :i
      And @invoke element:Activity_1gn8sum in :i
      And @invoke element:Activity_1gw4tt4 key "A" in :i
      And @invoke element:Activity_1gw4tt4 key "B" in :i
    Then @check :i has 0 items of element:Activity_1f1t7or with status "wait"
      And @check :i has 2 items of element:Activity_1pheg12 with status "wait"
