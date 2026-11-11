Feature: Assign Employee

  @generated @integration
  Scenario: Path to Done
    When @start process:"Assign Employee" as :instance
      | employeeId | "EMP-009" |
      | projectId | "PRJ-001" |
      | role | "Analyst" |
      | allocation | "50" |
      | startDate | "2026-12-01" |
      | endDate | "2026-12-31" |
