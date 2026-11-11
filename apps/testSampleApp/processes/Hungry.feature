Feature: Hungry

  @generated
  Scenario: Path to eat meal
    When @start process:Hungry as :instance
    And @invoke element:UserTask_1a8i191 in :instance
      | meal | "pasta" |
    And @invoke element:UserTask_1llznb6 in :instance
    And @invoke element:userTask_pasta in :instance
    And @invoke element:UserTask_0imlyu7 in :instance

  @generated
  Scenario: Path to cook steak
    When @start process:Hungry as :instance
    And @invoke element:UserTask_1a8i191 in :instance
      | meal | "steak" |
    And @invoke element:UserTask_1llznb6 in :instance
    And @invoke element:userTask_steak in :instance
    And @invoke element:UserTask_0imlyu7 in :instance
