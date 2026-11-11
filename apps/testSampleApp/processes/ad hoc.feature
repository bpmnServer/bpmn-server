Feature: ad hoc

  @generated
  Scenario: Path to Task 3
    When @start process:"ad hoc" as :instance
      | days | 6 |
    And @invoke element:Activity_0o0xpek in :instance
    And @invoke element:Activity_15454fl in :instance
