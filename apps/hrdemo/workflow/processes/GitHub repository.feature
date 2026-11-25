Feature: GitHub repository

  @generated
  Scenario: Path to Get the repository
    When @start process:"GitHub repository" as :instance
      | owner | "bpmnServer" |
      | repo | "bpmn-server" |

  Scenario: No rep
    When @start process:"GitHub repository" as :instance
      | owner | "bpmnServer99" |
      | repo | "bpmn-server" |
    And @check :instance passed element:NotFound with status "end"
