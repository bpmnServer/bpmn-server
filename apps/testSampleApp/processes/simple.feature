Feature: simple
  Plain tasks run through by themselves, the gateway's one way with them.

  Scenario: The tasks run through to the end
    When @start process:simple as :i
    Then @check :i status is "end"
      And @check :i passed element:task2 with status "end"
      And @check :i passed element:Activity_0df0iuv with status "end"
      And @check :i passed element:endEvent1
