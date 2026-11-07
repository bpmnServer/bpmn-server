Feature: Buy Used Car

  Scenario: Scenario 1
    When @start process:"Buy Used Car" as :instance
    And @invoke element:task_Buy in :instance
      | needsRepairs | "No" |
      | needsCleaning | "No" |
    And @invoke element:task_Drive in :instance

  Scenario: Scenario 2
    When @start process:"Buy Used Car" as :instance
    And @invoke element:task_Buy in :instance
      | needsRepairs | "Yes" |
      | needsCleaning | "Yes" |
    And @invoke element:task_repair in :instance
    And @invoke element:task_clean in :instance
    And @invoke element:task_Drive in :instance
    Then @check :instance passed element:gateway_2 with status "end"

  Scenario: Scenario 3
    When @start process:"Buy Used Car" as :instance
    And @invoke element:task_Buy in :instance
      | needsRepairs | "Yes" |
      | needsCleaning | "No" |
    And @invoke element:task_repair in :instance
    And @invoke element:task_Drive in :instance

  Scenario: Scenario 4
    When @start process:"Buy Used Car" as :instance
    And @invoke element:task_Buy in :instance
      | needsRepairs | "No" |
      | needsCleaning | "No" |
    And @invoke element:task_Drive in :instance
