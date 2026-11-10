Feature: test_gateway4

  Scenario: Run Task (gateway4.js)
    When @start process:test_gateway4 as :i
      | caseId | 9214 |
    And @check :i element:R1 status is "wait"
    And @check :i element:R2 status is "wait"
    And @check :i element:T1 status is "wait"
    And @check :i element:T2 status is "wait"
    And @invoke element:R1 in :i
    And @check :i element:R1 status is "end"
    And @check :i element:R2 status is "end"
    And @check :i element:T1 status is "end"
    And @check :i element:T2 status is "end"

  Scenario: Fire Timer (gateway4.js)
    When @start process:test_gateway4 as :i
      | caseId | 9215 |
    And @check :i element:R1 status is "wait"
    And @check :i element:R2 status is "wait"
    And @check :i element:T1 status is "wait"
    And @check :i element:T2 status is "wait"
    And @invoke element:T1 in :i
    And @check :i element:R1 status is "end"
    And @check :i element:R2 status is "end"
    And @check :i element:T1 status is "end"
    And @check :i element:T2 status is "end"
