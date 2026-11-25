Feature: employee-onboarding

  Scenario: Scenario 1
    When @start process:employee-onboarding as :instance
      | department | "Engineering" |
      | isManager | false |

  Scenario: Scenario 2
    When @start process:employee-onboarding as :instance
      | department | "Engineering" |
      | isManager | false |
