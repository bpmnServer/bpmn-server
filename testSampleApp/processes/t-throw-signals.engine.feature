Feature: t-throw-signals

  Scenario: signals.js
    When @start process:t-throw-signals as :i
      | caseId | 5001 |
    And @wait instances 1 within 20 seconds
      | name | "t-catch-signals1" |
      | data.caseId | 5001 |
      | data.signal | "signal-101" |
    And @wait instances 1 within 20 seconds
      | name | "t-catch-signals1" |
      | data.caseId | 5001 |
      | data.signal | "signal-102" |
    And @wait instances 1 within 20 seconds
      | name | "t-catch-signals2" |
      | data.caseId | 5001 |
      | data.signal | "signal-101" |
    And @wait instances 1 within 20 seconds
      | name | "t-catch-signals2" |
      | data.caseId | 5001 |
      | data.signal | "signal-102" |
