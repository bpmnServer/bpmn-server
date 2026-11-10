Feature: failing listener

  # The process start listener throws: the start fails, not later and unhandled
  Scenario: a failing process listener fails the start
    When @start process:"failing listener" as :i is refused
