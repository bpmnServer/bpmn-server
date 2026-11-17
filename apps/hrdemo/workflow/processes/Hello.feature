Feature: Hello
  The start asks for a name; Greet (the greet service) answers a greeting, kept as data.greeting; the greeting is read.

  Scenario: A greeting for the name given
    When @start process:Hello as :hello
      | name | "Ann" |
    Then @check :hello data.greeting is "Hello Ann, from Hello"
      And @check :hello last element:Read status is "wait"
    When @invoke element:Read in :hello
    Then @check :hello status is "end"

  Scenario: No name: a greeting all the same
    When @start process:Hello as :hello
    Then @check :hello data.greeting is "Hello there, from Hello"
