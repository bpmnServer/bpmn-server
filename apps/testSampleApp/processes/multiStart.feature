Feature: multiStart
  Scripts and services for each record, in parallel rounds: everything runs by itself.

  Scenario: Every round runs
    When @start process:multiStart as :i
    Then @check :i status is "end"
      And @check :i has 3 items of element:script_task with status "end"
      And @check :i has 3 items of element:service_task with status "end"
