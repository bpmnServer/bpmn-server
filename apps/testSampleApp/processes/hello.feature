Feature: hello

  @generated
  Scenario: Path to End
    When @start process:hello as :instance
      | name | "" |
    And @invoke element:Read in :instance
