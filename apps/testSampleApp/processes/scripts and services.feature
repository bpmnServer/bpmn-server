Feature: scripts and services
  A script and a service for each of the records, then a send task: everything runs by itself.

  Scenario: Every round runs, then the send task
    When @start process:"scripts and services" as :i
    Then @check :i status is "end"
      And @check :i data.records is [1,2,3]
      And @check :i has 3 items of element:scriptTask with status "end"
      And @check :i has 3 items of element:serviceTask with status "end"
      And @check :i passed element:sendTask with status "end"
