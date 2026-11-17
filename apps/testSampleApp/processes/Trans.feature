Feature: Trans
  A transaction: book a flight, book a hotel, confirm. Confirmed, it is processed; an error ends the process;
  cancelled, the cancellation is processed.

  Scenario: Confirmed: processed, then the final check succeeds
    When @start process:Trans as :i
      And @invoke element:Activity_bookFlight in :i
      And @invoke element:Activity_bookHotel in :i
      And @invoke element:Activity_confirm in :i
      | cancel | "false" |
      | error  | "false" |
    Then @check :i passed element:Activity_123wbxy with status "end"
      And @check :i passed element:Event_end_trans
    When @invoke element:Activity_after_trans in :i
      | cancel2 | "false" |
    Then @check :i status is "end"
      And @check :i passed element:Event_end

  Scenario: An error in the transaction: caught on it, the process ends
    When @start process:Trans as :i
      And @invoke element:Activity_bookFlight in :i
      And @invoke element:Activity_bookHotel in :i
      And @invoke element:Activity_confirm in :i
      | cancel | "false" |
      | error  | "true"  |
    Then @check :i passed element:Event_error_catcher
      And @check :i passed element:Event_end_error
      And @check :i has 0 items of element:Activity_after_trans with status "wait"
      And @check :i status is "end"

  Scenario: Cancelled: the cancellation is processed
    When @start process:Trans as :i
      And @invoke element:Activity_bookFlight in :i
      And @invoke element:Activity_bookHotel in :i
      And @invoke element:Activity_confirm in :i
      | cancel | "true"  |
      | error  | "false" |
    Then @check :i passed element:Event_catch_cancel
      And @check :i passed element:Activity_after_trans_cancel with status "end"
      And @check :i status is "end"
