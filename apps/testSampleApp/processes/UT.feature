Feature: UT
  Two user tasks in a row.

  Scenario: Both done
    When @start process:UT as :i
      And @invoke element:Activity_093ctfm in :i
    Then @check :i last element:Activity_0z979th status is "wait"
    When @invoke element:Activity_0z979th in :i
    Then @check :i status is "end"
