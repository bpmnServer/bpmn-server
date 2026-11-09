Feature: messageFlow

  Scenario: messageFlow.js
    When @start process:messageFlow at element:StartEvent_1 as :i
    And @check :i status is "end"
