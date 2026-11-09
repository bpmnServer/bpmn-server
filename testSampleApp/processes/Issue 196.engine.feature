Feature: Issue 196

  Scenario: All path (Issue196.js)
    When @start process:"Issue 196" as :i
    And @invoke element:Activity_UT1 key "1" in :i
    And @invoke element:Activity_UT1 key "2" in :i
    And @check :i has 12 items with status "wait"
    And @check :i has 0 items with status "start"

  Scenario: Cancel (Issue196.js)
    When @start process:"Issue 196" as :i
    And @invoke element:Activity_UT1 key "1" in :i
    And @invoke element:Activity_UT1 key "2" in :i
    And @invoke element:Event_Cancel key "2" in :i
    And @check :i has 0 items with status "wait"
    And @check :i has 0 items with status "start"

  Scenario: Error (Issue196.js)
    When @start process:"Issue 196" as :i
    And @invoke element:Activity_UT1 key "1" in :i
    And @invoke element:Activity_UT1 key "2" in :i
    And @invoke element:Event_Error key "2" in :i
    And @check :i has 0 items with status "wait"
    And @check :i has 0 items with status "start"
