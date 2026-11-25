Feature: loop
  A sequential script and a parallel service for each of the records, then a subprocess for each of A, B and C
  with a script for each of 1 and 2 in it: everything runs by itself.

  Scenario: Every round runs, and both ends are reached
    When @start process:loop as :i
    Then @check :i status is "end"
      And @check :i has 5 items of element:script_task with status "end"
      And @check :i has 5 items of element:service_task with status "end"
      And @check :i has 3 items of element:SubProcess with status "end"
      And @check :i has 6 items of element:Sub_script with status "end"
      And @check :i passed element:Event_0bf16wv
      And @check :i passed element:Event_0m985mm
