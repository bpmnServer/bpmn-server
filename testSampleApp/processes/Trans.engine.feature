Feature: Trans

  Scenario: Complete Process (trans.js)
    When @start process:Trans as :i
      | caseId | 6010 |
      | scenario | "Complete Process" |
    And @invoke element:Activity_bookFlight in :i
    And @invoke element:Activity_bookHotel in :i
    And @invoke element:Activity_confirm in :i
    And @invoke element:Activity_after_trans in :i
    And @check :i element:Event_end status is "end"
  Scenario: Error thrown (trans.js)
    When @start process:Trans as :i
      | caseId | 6011 |
      | scenario | "Error thrown" |
    And @invoke element:Activity_bookFlight in :i
    And @invoke element:Activity_bookHotel in :i
    And @invoke element:Activity_confirm in :i
      | error | "true" |
    And @check :i element:Event_end_error status is "end"
  Scenario: Cancel thrown (trans.js)
    When @start process:Trans as :i
      | caseId | 6012 |
      | scenario | "Cancel thrown" |
    And @invoke element:Activity_bookFlight in :i
    And @invoke element:Activity_bookHotel in :i
    And @invoke element:Activity_confirm in :i
      | cancel | "true" |
    And @check :i element:Activity_after_trans_cancel status is "end"
  Scenario: Cancel after Complete Process (trans.js)
    When @start process:Trans as :i
      | caseId | 6013 |
      | scenario | "Cancel after Complete Process" |
    And @invoke element:Activity_bookFlight in :i
    And @invoke element:Activity_bookHotel in :i
    And @invoke element:Activity_confirm in :i
    And @invoke element:Activity_after_trans in :i
      | cancel2 | "true" |
    And @check :i element:Activity_cancelHotel status is "end"
