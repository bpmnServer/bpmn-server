Feature: Cash Request

  Scenario: Scenario 1
    When @start process:"Cash Request" as :instance
    And @invoke element:Activity_03i6maz in :instance
    And @invoke element:task_approval in :instance
      | approved | false |

  Scenario: Scenario 2
    When @start process:"Cash Request" as :instance
    And @invoke element:Activity_03i6maz in :instance
    And @invoke element:task_approval in :instance
      | approved | true |
