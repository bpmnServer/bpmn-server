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

  @generated
  Scenario: Path to Done (2)
    When @start process:"Assign Employee" as :instance
      | employeeId | "EMP-009" |
      | projectId | "PRJ-001" |
      | role | "Analyst" |
      | allocation | "50" |
      | startDate | "2026-12-01" |
      | endDate | "2026-12-31" |

  Scenario: Not found
    When @start process:"Assign Employee" as :instance
      | employeeId | "EMP-0999" |
      | projectId | "PRJ-001" |
      | role | "Analyst" |
      | allocation | 50 |
      | startDate | "2026-12-01" |
      | endDate | "2026-12-31" |
    And @check :instance passed element:NotFound with status "end"
    Then @check :instance data.errorCode is "HTTP_404"
