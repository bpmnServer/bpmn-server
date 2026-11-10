Feature: Event Based Gateway

  @generated
  Scenario: Path to Reminder
    When @start process:"Event Based Gateway" as :instance
    And @invoke element:timerEvent in :instance
    And @invoke element:reminder in :instance

  @generated
  Scenario: Path to Flow: Receive Response → endEvent
    When @start process:"Event Based Gateway" as :instance
    And @invoke element:Task_receive in :instance
