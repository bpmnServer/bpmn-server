Feature: GitHub repository

  # calls GitHub through the github connector (added from the catalog): on a server that has it
  @integration
  Scenario: Scenario 1
    When @start process:"GitHub repository" as :instance
      | owner | "bpmnServer" |
      | repo | "bpmn-server" |
