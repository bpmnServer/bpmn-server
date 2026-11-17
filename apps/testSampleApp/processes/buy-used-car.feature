Feature: buy-used-car
  Buy, then clean or repair or neither (an inclusive gateway; repairs as a service decides), then drive.

  Scenario: Nothing to clean: straight to driving
    When @start process:buy-used-car as :i
    Then @check :i data.startDate is not null
    When @invoke element:task_Buy in :i
      | needsRepairs  | "No" |
      | needsCleaning | "No" |
    Then @check :i has 0 items of element:task_clean with status "wait"
    When @invoke element:task_Drive in :i
    Then @check :i status is "end"

  Scenario: Cleaning needed
    When @start process:buy-used-car as :i
      And @invoke element:task_Buy in :i
      | needsCleaning | "Yes" |
    Then @check :i last element:task_clean status is "wait"
    When @invoke element:task_clean in :i
    Then @check :i last element:task_Drive status is "wait"
