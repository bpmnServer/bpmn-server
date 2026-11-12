Feature: Leave Application
  Each path of the leave request, before it reaches real users. The services are stubbed: no message is sent and
  nothing is recorded in HR's system.

  Scenario: An approved request is recorded, and the employee told
    Given @stub service:recordLeave with
      """javascript
      return { recordId: 'LV-1' };
      """
      And @stub service:notifyUsers with
      """javascript
      return { sent: 'now' };
      """
    When user:user1 @login with role of "Employee"
      And @start process:"Leave Application" as :leave
      And @invoke element:Request in :leave
        | LeaveType     | Vacation   |
        | StartDate     | 2026-12-01 |
        | EndDate       | 2026-12-05 |
        | RequestReason | Holidays   |
      And user:manager1 @login with role of "Manager"
      And @invoke element:Approve in :leave
        | approval | A     |
        | comment  | Enjoy |
    Then @check :leave status is "end"
      And @check :leave data.days is 5
      And @check :leave data.recordId is "LV-1"
      And @check :leave passed element:Tell 1 times

  Scenario: A long leave goes to HR, not to a manager (the policy LeaveApproval)
    When user:user1 @login with role of "Employee"
      And @start process:"Leave Application" as :leave
      And @invoke element:Request in :leave
        | LeaveType     | Vacation   |
        | StartDate     | 2026-12-01 |
        | EndDate       | 2026-12-20 |
        | RequestReason | Travel     |
      And user:manager1 @login with role of "Manager"
    Then @check :leave has 0 items of element:Approve with status "wait" for me
    When user:hr1 @login with role of "HR"
    Then @check :leave has 1 items of element:Approve with status "wait" for me

  Scenario: Wrong dates go back to the employee
    When user:user1 @login with role of "Employee"
      And @start process:"Leave Application" as :leave
      And @invoke element:Request in :leave
        | LeaveType | Vacation   |
        | StartDate | 2026-12-05 |
        | EndDate   | 2026-12-01 |
    Then @check :leave has 2 items of element:Request
      And @check :leave last element:Request status is "wait"
      And @check :leave passed element:Approve 0 times

  Scenario: A rejected request is not recorded, and the employee is told
    Given @stub service:notifyUsers with
      """javascript
      return { sent: 'now' };
      """
    When user:user1 @login with role of "Employee"
      And @start process:"Leave Application" as :leave
      And @invoke element:Request in :leave
        | LeaveType | Study      |
        | StartDate | 2026-12-01 |
        | EndDate   | 2026-12-02 |
      And user:manager1 @login with role of "Manager"
      And @invoke element:Approve in :leave
        | approval | Reject             |
        | comment  | Not during closing |
    Then @check :leave status is "end"
      And @check :leave passed element:Record 0 times
      And @check :leave passed element:Tell 1 times

  Scenario: Information required sends it back to the employee
    When user:user1 @login with role of "Employee"
      And @start process:"Leave Application" as :leave
      And @invoke element:Request in :leave
        | LeaveType | Vacation   |
        | StartDate | 2026-12-01 |
        | EndDate   | 2026-12-05 |
      And user:manager1 @login with role of "Manager"
      And @invoke element:Approve in :leave
        | approval | InformationRequired |
    Then @check :leave has 2 items of element:Request
      And @check :leave last element:Request status is "wait"

  Scenario: When HR's system refuses the record, HR fixes it and it is recorded
    Given @stub service:recordLeave with
      """javascript
      return data.fixed ? { recordId: 'LV-2' } : { bpmnError: 'RecordFailed' };
      """
      And @stub service:notifyUsers with
      """javascript
      return { sent: 'now' };
      """
    When user:user1 @login with role of "Employee"
      And @start process:"Leave Application" as :leave
      And @invoke element:Request in :leave
        | LeaveType | Vacation   |
        | StartDate | 2026-12-01 |
        | EndDate   | 2026-12-05 |
      And user:manager1 @login with role of "Manager"
      And @invoke element:Approve in :leave
        | approval | A |
    Then @check :leave last element:FixRecord status is "wait"
    When user:hr1 @login with role of "HR"
      And @invoke element:FixRecord in :leave
        | fixed | true |
    Then @check :leave status is "end"
      And @check :leave data.recordId is "LV-2"

  Scenario: The managers are reminded while Approve waits
    Given @stub timer:ReminderTimer with 1 seconds
      And @stub service:notifyUsers with
      """javascript
      return { sent: 'now' };
      """
    When user:user1 @login with role of "Employee"
      And @start process:"Leave Application" as :leave
      And @invoke element:Request in :leave
        | LeaveType | Vacation   |
        | StartDate | 2026-12-01 |
        | EndDate   | 2026-12-05 |
    Then @wait :leave passed element:Remind
      And @check :leave last element:Approve status is "wait"
