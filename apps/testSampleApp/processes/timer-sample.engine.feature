Feature: timer-sample

  Scenario: timerSample.js
    When @start process:timer-sample as :i
    And @wait :i status is "end" within 30 seconds
