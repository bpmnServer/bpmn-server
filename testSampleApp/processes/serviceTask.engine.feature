Feature: serviceTask

  Scenario: serviceTask.js
    When @start process:serviceTask as :i
    And @check :i data.result is 8
    And @check :i data.result2 is 158
    And @check :i data.returnText is "out text:test"
