Feature: hello
  The start asks for a name; Greet answers a greeting, kept as data.greeting; the greeting is read. This app has no
  greet service: the scenarios stub it (sampleApp's and hrdemo's Hello run their own).

  Scenario: A greeting for the name given
    Given @stub service:greet with
      """javascript
      return `Hello ${input.name || 'there'}`;
      """
    When @start process:hello as :hello
      | name | "Ann" |
    Then @check :hello data.greeting is "Hello Ann"
      And @check :hello last element:Read status is "wait"
    When @invoke element:Read in :hello
    Then @check :hello status is "end"
