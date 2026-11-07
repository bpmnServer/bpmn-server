Feature: boundary-event

  Scenario: Scenario 1
    When @start process:boundary-event as :instance
    And @invoke element:Expired-Timer in :instance
