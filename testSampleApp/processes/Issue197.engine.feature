Feature: Issue197

  Scenario: Normal Flow (Issue197_cancel_loop.js)
    When @start process:Issue197 as :i
      | caseId | 9312 |
      | scenario | " normal flow" |
    And @check :i has 2 items of element:Activity_create_vote
    And @invoke element:Activity_create_vote key "HR" in :i
      | vote | "true" |
    And @invoke element:Activity_create_vote key "IT" in :i
      | vote | "true" |
    And @check :i element:Activity_sum_votes status is "wait"
    And @invoke element:Activity_sum_votes in :i
    And @check :i element:Event_end1 status is "end"

  Scenario: Normal Flow (loop2.js)
    When @start process:Issue197 as :i
      | caseId | 9313 |
      | scenario | " normal flow" |
    And @check :i has 2 items of element:Activity_create_vote
    And @invoke element:Activity_create_vote key "HR" in :i
      | vote | "true" |
    And @invoke element:Activity_create_vote key "IT" in :i
      | vote | "true" |
    And @check :i element:Activity_sum_votes status is "wait"
    And @invoke element:Activity_sum_votes in :i
    And @check :i element:Event_end1 status is "end"
