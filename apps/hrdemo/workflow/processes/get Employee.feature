Feature: get Employee

  Scenario: Scenario 1
    When @start process:"get Employee" as :instance
      | id | "EMP-002" |
    Then @check :instance data.employeeId is "EMP-002"

  Scenario: Not found
    When @start process:"get Employee" as :instance
      | id | "1119" |
    And @check :instance passed element:Event_Error with status "end"
    Then @check :instance data.errorCode is "HTTP_404"
