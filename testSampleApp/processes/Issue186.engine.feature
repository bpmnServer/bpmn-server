Feature: Issue186

  Scenario: straight path (Issue186.js)
    When @start process:Issue186 as :i
    And @check :i element:Activity_1olobi3 status is "wait"
    And @invoke element:Activity_1olobi3 key "IT" in :i
    And @invoke element:Activity_1mx9fl7 in :i
    And @check :i element:Activity_1olobi3 status is "end"
    And @check :i element:Event_1jag0kh status is "end"
