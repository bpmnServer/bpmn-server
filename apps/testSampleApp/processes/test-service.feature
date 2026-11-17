Feature: test-service
  A start form, then service99.

  Scenario: The service runs
    When @start process:test-service as :i
    Then @check :i passed element:Activity_1xeb3js with status "end"
      And @check :i status is "end"
