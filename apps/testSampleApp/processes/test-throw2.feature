Feature: test-throw2
  Pick a hotel, throw the stay period (which starts test-catch2), wait for the stay-end signal, request a review.

  Scenario: The stay ends; the review is requested
    When @start process:test-throw2 as :i
      And @invoke element:pick_hotel in :i
    Then @check :i passed element:Event_04d5bzt with status "end"
      And @check :i last element:hotel_stay_end status is "wait"
    When @invoke element:hotel_stay_end in :i
    Then @check :i passed element:request_review with status "end"
      And @check :i status is "end"
