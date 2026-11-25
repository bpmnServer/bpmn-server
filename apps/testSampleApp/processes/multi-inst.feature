Feature: multi-inst
  A vote in each department the script lists; the votes are summed up once all three have voted.

  Scenario: Each department votes
    When @start process:multi-inst as :i
    Then @check :i has 3 items of element:Activity_vote with status "wait"
      And @check :i data.department.IT.scriptLog is "added by script event,key:IT"
    When @invoke element:Activity_vote key "IT" in :i
      | vote | true |
      And @invoke element:Activity_vote key "HR" in :i
      | vote | false |
      And @invoke element:Activity_vote key "Billing" in :i
      | vote | true |
    Then @check :i status is "end"
      And @check :i passed element:Activity_summary with status "end"
      And @check :i data.department.HR.vote is false
