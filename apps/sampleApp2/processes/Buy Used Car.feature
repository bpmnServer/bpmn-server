Feature: Buy Used Car
  Buy, then repair, clean, both or neither (an inclusive gateway), then drive.

  Scenario: Neither: straight to driving
    When @start process:"Buy Used Car" as :car
      And @invoke element:task_Buy in :car
      | needsRepairs  | "No" |
      | needsCleaning | "No" |
    Then @check :car has 0 items of element:task_repair with status "wait"
      And @check :car has 0 items of element:task_clean with status "wait"
    When @invoke element:task_Drive in :car
    Then @check :car status is "end"
      And @check :car passed element:Event_19ebav7

  Scenario: Both: the drive waits for the repair and the cleaning
    When @start process:"Buy Used Car" as :car
      And @invoke element:task_Buy in :car
      | needsRepairs  | "Yes" |
      | needsCleaning | "Yes" |
      And @invoke element:task_repair in :car
    Then @check :car has 0 items of element:task_Drive with status "wait"
    When @invoke element:task_clean in :car
      And @invoke element:task_Drive in :car
    Then @check :car status is "end"
