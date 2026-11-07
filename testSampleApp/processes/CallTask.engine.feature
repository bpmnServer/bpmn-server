Feature: CallTask

  Scenario: callTask.js
    When @start process:CallTask as :i
      | caseId | 9411 |
    And @find element:task_Buy as :buy
      | data.caseId | 9411 |
      | item.status | "wait" |
    And @invoke :buy
    And @find element:task_Drive as :drive
      | data.caseId | 9411 |
      | item.status | "wait" |
    And @invoke :drive
    And @check items 1
      | data.caseId | 9411 |
      | items.elementId | "task_Drive" |
      | items.status | "end" |
    And @check items 1
      | data.caseId | 9411 |
      | items.elementId | "Event_19ebav7" |
      | items.status | "end" |
    And @check :i element:activity_call status is "end"
    And @check :i element:Event_1wxl4bq status is "end"
