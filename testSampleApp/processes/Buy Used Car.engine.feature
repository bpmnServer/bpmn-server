Feature: Buy Used Car

  Scenario: buy, no repairs
    When @start process:"Buy Used Car" as :instance
      | caseId | 1 |
    And @invoke element:task_Buy in :instance
      | needsCleaning | "No" |
      | needsRepairs | "No" |
    And @check :instance data.needsRepairs is "No"
    And @invoke element:task_Drive in :instance
    Then @check :instance status is "end"
    And @check :instance passed element:task_repair 0 times

  Scenario: buy, needs repairs
    When @start process:"Buy Used Car" as :instance
      | caseId | 2 |
    And @invoke element:task_Buy in :instance
      | needsCleaning | "No" |
      | needsRepairs | "Yes" |
    And @invoke element:task_repair in :instance
    Then @check :instance passed element:task_repair 1 times
