Feature: test escalation level
  Subprocesses in subprocesses, each for 1 and 2, with error and escalation boundary events at each level: a user
  task for each pair of rounds.

  Scenario: All four tasks done, every level ends
    When @start process:"test escalation level" as :i
    Then @check :i has 4 items of element:Activity_1lmruof with status "wait"
    When @invoke element:Activity_1lmruof key "1.1" in :i
      And @invoke element:Activity_1lmruof key "1.2" in :i
      And @invoke element:Activity_1lmruof key "2.1" in :i
    Then @check :i status is "running"
    When @invoke element:Activity_1lmruof key "2.2" in :i
    Then @check :i status is "end"
      And @check :i passed element:Event_0n55ro5
      And @check :i has 0 items of element:Activity_13jlixu with status "end"
