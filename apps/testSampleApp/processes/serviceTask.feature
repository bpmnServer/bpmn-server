Feature: serviceTask
  Three services in a row, their input from parameters and from a start listener, their output kept by an end listener.

  Scenario: add, add with a listener's input, then service1
    When @start process:serviceTask as :i
    Then @check :i status is "end"
      And @check :i data.result is 8
      And @check :i data.result2 is 158
      And @check :i data.returnText is "out text:test"
