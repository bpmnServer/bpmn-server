Feature: Invoice

  @generated
  Scenario: Path to Cancel by Admin
    When @start process:Invoice at element:StartEvent_AP as :instance
      | reminderCounter | 0 |
    And @invoke element:task_issue_invoice in :instance
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
    And @invoke element:event_timer in :instance
    And @invoke element:event_cancel in :instance

  Scenario: Paid in Full
    When @start process:Invoice as :instance
    And @invoke element:task_issue_invoice in :instance
