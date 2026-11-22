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

  Scenario: A manager cancels one invoice, by its number
    Two invoices wait for their payment; the manager cancels I-2: its cancelInvoice message, with the matching key
    { 'data.InvoiceNo': 'I-2' }, ends I-2 and leaves I-1 waiting.
    When @start process:Invoice at element:StartEvent_AP as :one
      | InvoiceNo | I-1 |
    And @invoke element:task_issue_invoice in :one
    And @start process:Invoice at element:StartEvent_AP as :two
      | InvoiceNo | I-2 |
    And @invoke element:task_issue_invoice in :two
    And @start process:Invoice at element:StartEvent_Manager as :cancel
      | InvoiceNo | I-2 |
    And @invoke element:Task_cancelByAdmin in :cancel
    Then @check :cancel status is "end"
    And @check :two status is "end"
    And @check :two last element:event_cancel status is "end"
    And @check :one last element:event_cancel status is "wait"
    And @check :one last element:task_got_payment status is "wait"

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
