Feature: loop-engine-test

  Scenario: loop.js
    When @start process:loop-engine-test as :i
      | records | [1, 2, 3] |
    And @check :i has 5 items of element:script_task
    And @check :i has 5 items of element:service_task
    And @check :i has 6 items of element:Sub_script
    And @check :i has 3 items of element:SubProcess
