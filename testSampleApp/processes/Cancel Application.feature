Feature: Cancel Application

  @generated
  Scenario: Path to Continue Processing
    When @start process:"Cancel Application" as :instance
    And @invoke element:apply in :instance
    And @invoke element:approve in :instance

  @generated
  Scenario: Path to 'Re-Apply': Gateway_2 → subProcess
    When @start process:"Cancel Application" as :instance
    And @invoke element:apply in :instance
    And @invoke element:cancel in :instance
      | Cancel | "" |
    And @invoke element:apply in :instance
    And @invoke element:approve in :instance
