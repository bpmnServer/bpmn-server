Feature: loop1

  # Issue #233: a parallel loop inside a sequential loop keys its items outer.inner
  Scenario: nested loops key their items outer.inner
    When @start process:loop1 as :i
    And @check :i has 2 items of element:Activity_1qe2z25
    And @invoke element:Activity_1qe2z25 key "1.1" in :i
    And @invoke element:Activity_1qe2z25 key "1.2" in :i
    And @check :i has 4 items of element:Activity_1qe2z25
    And @invoke element:Activity_1qe2z25 key "2.1" in :i
    And @invoke element:Activity_1qe2z25 key "2.2" in :i
    And @check :i status is "end"
