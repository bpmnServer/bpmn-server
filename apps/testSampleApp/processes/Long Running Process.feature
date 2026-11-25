Feature: Long Running Process
  A subprocess four hundred times, one after the other, each a plain task.

  Scenario: All four hundred rounds run to the end
    When @start process:"Long Running Process" as :i
    Then @check :i status is "end"
      And @check :i has 400 items of element:Activity_0hpr7zr with status "end"
      And @check :i passed element:Event_0i3zqoy
