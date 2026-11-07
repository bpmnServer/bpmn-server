Feature: Issue197A.txt

  Scenario: Cancel Flow (Issue197A.js)
    When @start process:Issue197A.txt as :i
      | caseId | 9311 |
      | scenario | " normal flow" |
    And @check :i has 2 items of element:Activity_1olobi3
    And @invoke element:Event_0qsfmsy key "IT" in :i
      | vote | "true" |
    And @check :i element:Activity_1olobi3 status is "end"
    And @check :i element:Event_0qsfmsy status is "end"
    And @check :i element:Activity_1hcyu4w status is "end"
    And @check :i element:Event_1s6yeg2 status is "end"
