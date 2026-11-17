Feature: Leave Application2
  A request, then the supervisor's approval: approved it is processed, rejected the process ends, and more
  information required sends it back to the requester.

  Scenario: Approved, then processed
    When @start process:"Leave Application2" as :i
      And @invoke element:Request in :i
      | RequestReason | "Holidays" |
    Then @check :i last element:Approve assignee is "Supervisor"
    When @invoke element:Approve in :i
      | approval | "Approve" |
    Then @check :i passed element:Activity_1rx1txe with status "end"
      And @check :i passed element:Event_1qg3mz1
      And @check :i status is "end"

  Scenario: Rejected: the process ends
    When @start process:"Leave Application2" as :i
      And @invoke element:Request in :i
      And @invoke element:Approve in :i
      | approval | "Reject" |
    Then @check :i passed element:Event_02om8ew
      And @check :i status is "end"

  Scenario: More information required: back to the request
    When @start process:"Leave Application2" as :i
      And @invoke element:Request in :i
      And @invoke element:Approve in :i
      | approval | "InformationRequired" |
    Then @check :i last element:Request status is "wait"
      And @check :i passed element:Request 1 times with status "end"
