Feature: Flight Distruption

  @generated
  Scenario: Path to Complete Rebooking
    When @start process:"Flight Distruption" as :instance
    And @invoke element:Activity_076vdky in :instance
      | found_flight | "true" |
    And @invoke element:Activity_1kp7cku in :instance

  @generated
  Scenario: Path to Wait for Flight Availablity
    When @start process:"Flight Distruption" as :instance
    And @invoke element:Activity_076vdky in :instance
      | found_flight | false |
    And @invoke element:Activity_10rof0x in :instance
    And @invoke element:Activity_1kp7cku in :instance
