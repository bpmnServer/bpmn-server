Feature: test-catch2
  Started by the stay period: welcome the guest, the stay (a timer), check out, and end with the stay-end signal.

  Scenario: Welcome, stay, check out
    When @start process:test-catch2 as :i
      | caseId | 1003 |
    Then @check :i passed element:welcome_guest with status "end"
      And @check :i last element:stay_period status is "wait"
    When @invoke element:stay_period in :i
    Then @check :i passed element:check_out with status "end"
      And @check :i status is "end"
