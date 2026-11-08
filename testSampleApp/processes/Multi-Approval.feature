Feature: Multi-Approval

  @generated
  Scenario: Path to B
    When @start process:Multi-Approval as :instance
    And @invoke element:Activity_1933u7m in :instance
    And @invoke element:Activity_0eimdk4 in :instance
    And @invoke element:Activity_0gti5wn in :instance
    And @invoke element:Activity_1i7eqt9 in :instance
    And @invoke element:Activity_1i7eqt9 in :instance
    And @invoke element:Activity_1i7eqt9 in :instance

  @generated
  Scenario: Path to Flow: Treasury → Gateway_04swq36
    When @start process:Multi-Approval as :instance
    And @invoke element:Activity_0kwhbk9 in :instance
    And @invoke element:Activity_0eimdk4 in :instance
    And @invoke element:Activity_0gti5wn in :instance
    And @invoke element:Activity_1i7eqt9 in :instance
    And @invoke element:Activity_1i7eqt9 in :instance
    And @invoke element:Activity_1i7eqt9 in :instance
