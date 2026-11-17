Feature: Standard Loop
  A user task once for each of A, B and C. Its end listener calls this.token.loop.end() once two rounds are done:
  the third is cancelled and the script after it runs.

  Scenario: Two rounds done, the loop ends early
    When @start process:"Standard Loop" as :i
    Then @check :i has 3 items of element:Activity_0d5v1gg with status "wait"
    When @invoke element:Activity_0d5v1gg key "A" in :i
    Then @check :i has 2 items of element:Activity_0d5v1gg with status "wait"
    When @invoke element:Activity_0d5v1gg key "B" in :i
    Then @check :i has 0 items of element:Activity_0d5v1gg with status "wait"
      And @check :i passed element:Activity_1fk73pm with status "end"
      And @check :i status is "end"
