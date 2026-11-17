Feature: test-import
  A transaction whose only way out is its error end event (the hotel booking fails): the error caught on it ends
  the process.

  Scenario: The transaction's error ends the process
    When @start process:test-import as :i
    Then @check :i passed element:Event_raise_errr_trans
      And @check :i passed element:Event_end_error
      And @check :i status is "end"
