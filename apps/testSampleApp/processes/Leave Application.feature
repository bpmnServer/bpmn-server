Feature: Leave Application

  Scenario: Scenario 1
    When @start process:"Leave Application" as :instance
    And @invoke element:Request in :instance
      | RequestReason | "" |
      | LeaveType | "" |
      | StartDate | "" |
      | EndDate | "" |
    And @invoke element:Approve in :instance
      | approval | "" |
