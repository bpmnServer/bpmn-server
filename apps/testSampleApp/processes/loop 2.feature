Feature: loop 2

  @generated
  Scenario: Path to Parallel
    When @start process:"loop 2" as :instance
    And @invoke element:Activity_0mkzuuo in :instance
    And @invoke element:Activity_046mi5n in :instance
    And @invoke element:Activity_1ifvldg key "A" in :instance
    And @invoke element:Activity_1ifvldg key "B" in :instance
    And @invoke element:Activity_1ifvldg key "C" in :instance
    And @invoke element:Activity_1ifvldg key "D" in :instance
    And @invoke element:Activity_0mkzuuo in :instance
    And @invoke element:Activity_046mi5n in :instance
    And @invoke element:Activity_0mkzuuo in :instance
    And @invoke element:Activity_046mi5n in :instance
    And @invoke element:Activity_0mkzuuo in :instance
