Feature: GitHub repository

  Scenario: Scenario 1
    When @start process:"GitHub repository" as :instance
      | owner | "bpmnServer" |
      | repo | "bpmn-server" |
