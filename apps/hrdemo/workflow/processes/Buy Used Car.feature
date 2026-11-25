Feature: Buy Used Car

  @generated
  Scenario: Path to Bye
    When @start process:"Buy Used Car" as :instance
    And @invoke element:task_Buy in :instance
      | needsRepairs | "No" |
      | needsCleaning | "No" |
    And @invoke element:task_Drive in :instance

  @generated
  Scenario: Path to Repair
    When @start process:"Buy Used Car" as :instance
    And @check :instance passed element:task_Buy 1 times with status "wait"
    And @invoke element:task_Buy in :instance
      | needsRepairs | "Yes" |
      | needsCleaning | "No" |
    And @invoke element:task_repair in :instance
    And @invoke element:task_Drive in :instance

  @generated
  Scenario: Path to Clean
    When @start process:"Buy Used Car" as :instance
    And @invoke element:task_Buy in :instance
      | needsRepairs | "No" |
      | needsCleaning | "Yes" |
    And @invoke element:task_clean in :instance
    And @invoke element:task_Drive in :instance

  Scenario: Repair and Clean
    When @start process:"Buy Used Car" as :instance
    And @invoke element:task_Buy in :instance
      | needsRepairs | "Yes" |
      | needsCleaning | "Yes" |
      | carModel | "Caddy" |
    And @invoke element:task_repair in :instance
    And @invoke element:task_clean in :instance
    And @invoke element:task_Drive in :instance
