Feature: leave-request
  Staff submit a request; more than five days goes to a manager, the rest is approved automatically.

  Scenario: Three days: approved automatically
    When user:sam @login with role of "staff"
      And @start process:leave-request as :leave
      And @invoke element:Submit in :leave
      | days   | 3          |
      | reason | "Wedding" |
    Then @check :leave status is "end"
      And @check :leave passed element:AutoApproved
      And @check :leave data.approvedBy is "system"

  Scenario: Eight days: a manager approves; staff can not
    When user:sam @login with role of "staff"
      And @start process:leave-request as :leave
      And @invoke element:Submit in :leave
      | days | 8 |
    Then @check :leave has 0 items of element:Approve with status "wait" for me
      And @invoke element:Approve in :leave is refused
    When user:mia @login with role of "manager"
      And @invoke element:Approve in :leave
    Then @check :leave passed element:Approved
      And @check :leave status is "end"
