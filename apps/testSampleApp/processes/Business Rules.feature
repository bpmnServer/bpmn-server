Feature: Business Rules
  A script fills in the credit score and income where none is given; the loanApproval decision table decides.

  Scenario: The defaults: conditional approval, a tenth of the income
    When @start process:"Business Rules" as :i
    Then @check :i status is "end"
      And @check :i data.creditScore is 650
      And @check :i data.loan.approvalStatus is "Conditional Approval"
      And @check :i data.loan.maxAmount is 4500

  Scenario: A high score and income: approved
    When @start process:"Business Rules" as :i
      | creditScore | 780   |
      | income      | 90000 |
    Then @check :i data.loan.approvalStatus is "Approved"
      And @check :i data.loan.maxAmount is 5000
