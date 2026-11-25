Feature: LeaveApproval.policy

  Scenario: Test 1
    When @evaluate decision:LeaveApproval.policy as :result
      | days | 20 |
