Feature: Retrieve Employee
  @generated
  Scenario: Path to Event_054i4m5
    When @start process:"Retrieve Employee" as :instance
      | id | "1119" |

  Scenario: Not found
    When @start process:"Retrieve Employee" as :instance
      | id | "emp-03" |
    And @check :instance passed element:Event_Error with status "end"

  Scenario: Employee EMP-002
    When @start process:"Retrieve Employee" as :instance
      | id | "EMP-002" |
    Then @check :instance data.id is "EMP-002"
