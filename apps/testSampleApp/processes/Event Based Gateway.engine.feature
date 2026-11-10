Feature: Event Based Gateway

  Scenario: gateway.js
    When @start process:"Event Based Gateway" as :i
      | reminderCounter | 0 |
      | caseId | 9201 |
    And @check :i element:timerEvent status is "wait"
    And @check :i element:messageEvent status is "wait"
    And @check :i element:Task_receive status is "wait"
    And @check :i element:event_signal status is "wait"
    And @wait :i element:timerEvent status is "end" within 40 seconds
    And @check :i element:messageEvent status is "end"
    And @check :i element:Task_receive status is "end"
    And @check :i element:event_signal status is "end"
    And @check :i element:reminder status is "wait"
    And @invoke first element:reminder in :i

  Scenario: ebg.js
    When @start process:"Event Based Gateway" as :i
      | reminderCounter | 0 |
      | caseId | 9202 |
    And @check :i element:timerEvent status is "wait"
    And @check :i element:messageEvent status is "wait"
    And @check :i element:Task_receive status is "wait"
    And @check :i element:event_signal status is "wait"
    And @wait :i element:timerEvent status is "end" within 40 seconds
    And @check :i element:messageEvent status is "end"
    And @check :i element:Task_receive status is "end"
    And @check :i element:event_signal status is "end"
    And @check :i element:reminder status is "wait"
    And @invoke first element:reminder in :i

  Scenario: eventBasedGateway.js
    When @start process:"Event Based Gateway" as :i
      | reminderCounter | 0 |
      | caseId | 9203 |
    And @check :i element:timerEvent status is "wait"
    And @check :i element:messageEvent status is "wait"
    And @check :i element:Task_receive status is "wait"
    And @check :i element:event_signal status is "wait"
    And @wait :i element:timerEvent status is "end" within 40 seconds
    And @check :i element:messageEvent status is "end"
    And @check :i element:Task_receive status is "end"
    And @check :i element:event_signal status is "end"
    And @check :i element:reminder status is "wait"
    And @invoke first element:reminder in :i
