Feature: Users Vote
  A subprocess asks group A's and group B's users to vote; a vote's end listener raises an escalation, which the
  subprocess's boundary event catches: the first vote ends the process.

  Scenario: Every user is asked; the first vote escalates
    When @start process:"Users Vote" as :i
    Then @check :i has 3 items of element:Activity_A with status "wait"
      And @check :i has 3 items of element:Activity_B with status "wait"
    When @invoke element:Activity_A key "user1" in :i
    Then @check :i passed element:Event_Escalation
      And @check :i has 0 items of element:Activity_B with status "wait"
      And @check :i status is "end"
