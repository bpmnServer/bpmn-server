Feature: test-service-input
  Two services in parallel, each with its own input parameter.

  Scenario: Both run with their input
    Given @stub service:service1 with
      """javascript
      return { got: input.param1 };
      """
    When @start process:test-service-input as :i
    Then @check :i status is "end"
      And @check :i passed element:service1 with status "end"
      And @check :i passed element:service2 with status "end"
