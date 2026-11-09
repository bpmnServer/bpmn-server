Feature: Invoice

  @generated
  Scenario: Path to Cancel by Admin
    When @start process:Invoice at element:StartEvent_AP as :instance
      | reminderCounter | 0 |
    And @check :instance passed element:task_issue_invoice 1 times with status "wait"
    And @check :instance passed element:SequenceFlow_129vlnl with status "end"
    And @invoke element:task_issue_invoice in :instance
    And @check :instance passed element:task_got_payment 1 times with status "wait"
    And @check :instance passed element:event_cancel 1 times with status "wait"
    And @check :instance passed element:SequenceFlow_1nmqrtq with status "end"
    And @invoke element:event_cancel in :instance

  @generated
  Scenario: Path to Cancel Invoice
    When @start process:Invoice at element:StartEvent_Manager as :instance
    And @invoke element:Task_cancelByAdmin in :instance
    And @invoke element:event_cancel in :instance

  Scenario: Reach EndEvent_0sxnxfz
    When @start process:Invoice at element:StartEvent_AP as :instance

  @generated
  Scenario: Path to Issue Reminder
    When @start process:Invoice at element:StartEvent_AP as :instance
    And @invoke element:task_issue_invoice in :instance
    And @invoke element:task_got_payment in :instance

  Scenario: Paid in Full
    When @start process:Invoice as :instance
    And @invoke element:task_issue_invoice in :instance
    And @invoke element:task_got_payment in :instance
    Then @check :instance status is "end"
    And @check :instance last element:event_cancel status is "end"
    And @check :instance last element:event_timer status is "end"

  Scenario: Scenario 6
    When @start process:Invoice as :instance
    And @invoke element:task_issue_invoice in :instance
    And @invoke element:event_timer in :instance
    And @invoke element:task_issue_invoice in :instance
    And @invoke element:event_cancel in :instance

  Scenario: Scenario 7
    When @start process:Invoice as :instance
    And @invoke element:task_issue_invoice in :instance
    And @invoke element:task_got_payment in :instance
