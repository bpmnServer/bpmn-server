Feature: multi-instanceErr
  A script lists the departments and includes them; a vote in each, then the votes summed up.

  Scenario: The one department votes
    When @start process:multi-instanceErr as :i
    Then @check :i data.includeDepartment is true
      And @check :i has 1 items of element:Activity_1olobi3 with status "wait"
    When @invoke element:Activity_1olobi3 in :i
      And @invoke element:Activity_1mx9fl7 in :i
    Then @check :i status is "end"
      And @check :i passed element:Event_1jag0kh
      And @check :i has 0 items of element:Event_01qez59 with status "end"
