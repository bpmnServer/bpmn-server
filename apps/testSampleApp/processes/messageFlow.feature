Feature: messageFlow
  Two pools: the second's task, and the first's.

  Scenario: The task done, both pools end
    When @start process:messageFlow as :i
      And @invoke element:Task_2 in :i
    Then @check :i status is "end"
      And @check :i passed element:EndEvent_second
      And @check :i passed element:EndEvent_prime
