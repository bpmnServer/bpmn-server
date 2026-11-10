Feature: Restart

  @generated
  Scenario: Path to Task 2
    When @start process:Restart at element:StartEvent_1 as :instance
    And @invoke element:task1 in :instance
    And @invoke element:task2 in :instance

  @generated
  Scenario: Path to Start 2
    When @start process:Restart at element:start2 as :instance
    And @invoke element:task1 in :instance
    And @invoke element:task2 in :instance
