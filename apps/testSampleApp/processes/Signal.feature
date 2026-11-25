Feature: Signal
  Three tasks in parallel, each cancelled by the signal Cancel_All; a fourth task, Cancel ?, throws it.

  Scenario: The three tasks done, the parallel branch ends; Cancel ? still waits
    When @start process:Signal as :i
      And @invoke element:Activity_0qilwzd in :i
      And @invoke element:Activity_1j0jypn in :i
      And @invoke element:Activity_0h61osn in :i
    Then @check :i passed element:Event_10xb9uo
      And @check :i last element:Activity_1qc2lbd status is "wait"
      And @check :i status is "running"

  Scenario: Cancel throws the signal; the tasks' boundary events end the instance
    When @start process:Signal as :i
      And @invoke element:Activity_1qc2lbd in :i
    Then @check :i status is "end"
      And @check :i passed element:Event_1pl691z
      And @check :i has 0 items of element:Activity_0qilwzd with status "wait"
