Feature: test-escalation
  A subprocess's task can throw an escalation; a non-interrupting boundary event sends it to a follow-up task, and
  a parallel join waits for both.

  Scenario: No escalation: the subprocess ends and so does the process
    When @start process:test-escalation as :i
      And @invoke element:Activity_userTask1 in :i
      | escalation | "false" |
    Then @check :i has 0 items of element:Activity_11tr5am with status "wait"
      And @check :i status is "end"

  Scenario: Escalated: the follow-up task too
    When @start process:test-escalation as :i
      And @invoke element:Activity_userTask1 in :i
      | escalation | "true" |
    Then @check :i passed element:Event_throw_escalation
      And @check :i last element:Activity_11tr5am status is "wait"
    When @invoke element:Activity_11tr5am in :i
    Then @check :i status is "end"
