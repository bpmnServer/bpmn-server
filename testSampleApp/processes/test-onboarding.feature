Feature: test-onboarding

  Scenario: Scenario 1
    When @start process:test-onboarding as :instance
    And @invoke element:submitDetails in :instance
      | employeeName | "" |
      | department | "" |
      | startDate | "" |
    And @invoke element:managerReview in :instance
      | approved | true |
    And @invoke element:itSetup in :instance
    And @invoke element:hrSetup in :instance
