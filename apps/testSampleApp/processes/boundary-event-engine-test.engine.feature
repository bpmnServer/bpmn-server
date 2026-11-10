Feature: boundary-event-engine-test

  Scenario: do the task right away: the events end (boundaryEvent.test.js)
    When @start process:boundary-event-engine-test as :i
      | caseId | 9401 |
    And @check :i element:user_task status is "wait"
    And @check :i element:Reminder-Timer status is "wait"
    And @check :i element:Expired-Timer status is "wait"
    And @check :i element:Cancel-Message status is "wait"
    And @invoke element:user_task in :i
    And @check :i element:user_task status is "end"
    And @check :i element:Reminder-Timer status is "end"
    And @check :i element:Reminder-Timer endedAt is null
    And @check :i element:Expired-Timer status is "end"
    And @check :i element:Expired-Timer endedAt is null
    And @check :i element:Cancel-Message status is "end"
    And @check :i element:Cancel-Message endedAt is null
    And @check :i element:process_request status is "end"
    And @check :i element:event_end status is "end"

  Scenario: wait for the timers (boundaryEvent.test.js)
    When @start process:boundary-event-engine-test as :i
      | caseId | 9402 |
      | scenario | "wait for timers" |
    And @wait :i element:Reminder-Timer status is "end" within 30 seconds
    And @check :i element:user_task status is "wait"
    And @check :i element:Expired-Timer status is "wait"
    And @check :i element:Cancel-Message status is "wait"
    And @wait :i element:Expired-Timer status is "end" within 60 seconds
    And @check :i element:user_task status is "end"
    And @check :i element:Reminder-Timer status is "end"
    And @check :i element:Cancel-Message status is "end"
