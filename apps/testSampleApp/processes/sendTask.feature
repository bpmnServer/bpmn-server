Feature: sendTask
  A send task and a service task, both on service2.

  Scenario: The send task and the service task run
    When @start process:sendTask as :i
    Then @check :i status is "end"
      And @check :i passed element:Activity_0bl4lv9 with status "end"
      And @check :i passed element:Activity_0msx103 with status "end"
