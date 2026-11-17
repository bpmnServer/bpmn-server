Feature: test_gateway5
  A department votes in a subprocess, again and again, until a vote is "true"; then the votes and cycles are checked.

  Scenario: A vote other than true counts a cycle and asks again
    When @start process:test_gateway5 as :i
      And @invoke element:Activity_1m6hqy8 in :i
      | vote | "false" |
    Then @check :i last element:Activity_19lw23s status is "wait"
    When @invoke element:Activity_19lw23s in :i
    Then @check :i last element:Activity_1m6hqy8 status is "wait"
    When @invoke element:Activity_1m6hqy8 in :i
      | vote | "true" |
    Then @check :i passed element:department with status "end"
    When @invoke element:Activity_1uh26d0 in :i
    Then @check :i status is "end"
      And @check :i passed element:Activity_19lw23s 1 times with status "end"
