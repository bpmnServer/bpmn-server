Feature: test-escalation2
  The script returns the escalation "review": not the boundary event's code ("correct"), and not an error, so the
  escalation event subprocess catches it and the script's task goes on to the teacher's acknowledgement.

  Scenario: The escalation goes to the event subprocess, not to the error boundary event
    When @start process:test-escalation2 as :i
    Then @check :i passed element:Activity_0jsh4sw
      And @check :i has 0 items of element:errorhandler with status "end"
      And @check :i has 0 items of element:Activity_correct with status "wait"
      And @check :i last element:teacheracknowledge status is "wait"
