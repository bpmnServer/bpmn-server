Feature: Issue 233

  Scenario: Loops of a sub-process in a sub-process (Issue233.js)
    When @start process:"Issue 233" as :i
    And @invoke element:Activity_0s1j60f in :i
    And @invoke element:Activity_F key "0.0" in :i
    And @invoke element:Activity_Z key "0.0" in :i
    And @invoke element:Activity_F key "0.1" in :i
    And @invoke element:Activity_Z key "0.1" in :i
    And @invoke element:Activity_F key "1.0" in :i
    And @invoke element:Activity_Z key "1.0" in :i
    And @invoke element:Activity_F key "1.1" in :i
    And @invoke element:Activity_Z key "1.1" in :i
    And @invoke element:Activity_F key "2.0" in :i
    And @invoke element:Activity_Z key "2.0" in :i
    And @invoke element:Activity_F key "2.1" in :i
    And @invoke element:Activity_Z key "2.1" in :i
    And @check :i has 0 items with status "wait"
    And @check :i element:Event_1gkaeoz status is "end"
