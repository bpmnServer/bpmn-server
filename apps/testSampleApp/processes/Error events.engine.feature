Feature: Error events

  Scenario: Complete Process (error.js)
    When @start process:"Error events" as :i
      | caseId | 7010 |
      | scenario | "Complete Process" |
    And @invoke element:UserTask2 in :i
      | Require_Review | "" |
      | Error_Code | "" |
    And @check :i element:UserTask2 status is "end"
    And @check :i element:EndEventNormal status is "end"
    And @check :i element:StartEvent_14s2cpf status is "end"
    And @check :i element:StartEvent_14s2cpf endedAt is null
    And @check :i element:BoundaryEvent_catchErrors status is "end"
    And @check :i element:BoundaryEvent_catchErrors endedAt is null
    And @check :i element:StartEvent_catchErrors status is "end"
    And @check :i element:StartEvent_catchErrors endedAt is null

  Scenario: Raise Escalation (error.js)
    When @start process:"Error events" as :i
      | caseId | 7011 |
      | scenario | "Raise Escalation" |
    And @invoke element:UserTask2 in :i
      | Require_Review | "true" |
      | Error_Code | "" |
    And @check :i element:UserTask2 status is "end"
    And @check :i element:EndEventNormal status is "end"
    And @check :i element:Event_0ce8dnc status is "end"
    And @check :i element:Event_catchEsclation status is "end"
    And @check :i element:Event_1e95dbp status is "end"
    And @check :i element:StartEvent_14s2cpf status is "end"
    And @check :i element:StartEvent_14s2cpf endedAt is null
    And @check :i element:BoundaryEvent_catchErrors status is "end"
    And @check :i element:BoundaryEvent_catchErrors endedAt is null
    And @check :i element:StartEvent_catchErrors status is "end"
    And @check :i element:StartEvent_catchErrors endedAt is null

  Scenario: Error 1 (error.js)
    When @start process:"Error events" as :i
      | caseId | 7012 |
      | scenario | "Error 1" |
    And @invoke element:UserTask2 in :i
      | Require_Review | "true" |
      | Error_Code | "Error1" |
    And @check :i element:UserTask2 status is "end"
    And @check :i element:Event_error1 status is "end"
    And @check :i element:Event_0ce8dnc status is "end"
    And @check :i element:Event_catchEsclation status is "end"
    And @check :i element:Event_1e95dbp status is "end"
    And @check :i element:StartEvent_catchErrors status is "end"
    And @check :i element:EndEvent_subprocessErrorHandler status is "end"
    And @check :i element:StartEvent_14s2cpf status is "end"
    And @check :i element:StartEvent_14s2cpf endedAt is null
    And @check :i element:BoundaryEvent_catchErrors status is "end"
    And @check :i element:BoundaryEvent_catchErrors endedAt is null

  Scenario: Error 2 (error.js)
    When @start process:"Error events" as :i
      | caseId | 7013 |
      | scenario | "Error 2" |
    And @invoke element:UserTask2 in :i
      | Require_Review | "true" |
      | Error_Code | "Error2" |
    And @check :i element:UserTask2 status is "end"
    And @check :i element:Event_error2 status is "end"
    And @check :i element:BoundaryEvent_catchErrors status is "end"
    And @check :i element:Event_catchEsclation status is "end"
    And @check :i element:Event_1e95dbp status is "end"
    And @check :i element:EndEvent_17fzol9 status is "end"
    And @check :i element:StartEvent_14s2cpf status is "end"
    And @check :i element:StartEvent_14s2cpf endedAt is null
    And @check :i element:StartEvent_catchErrors status is "end"
    And @check :i element:StartEvent_catchErrors endedAt is null

  Scenario: Error 3 (error.js)
    When @start process:"Error events" as :i
      | caseId | 7014 |
      | scenario | "Error 3" |
    And @invoke element:UserTask2 in :i
      | Require_Review | "true" |
      | Error_Code | "Error3" |
    And @check :i element:UserTask2 status is "end"
    And @check :i element:Event_error3 status is "end"
    And @check :i element:Event_catchEsclation status is "end"
    And @check :i element:Event_1e95dbp status is "end"
    And @check :i element:StartEvent_14s2cpf status is "end"
    And @check :i element:StartEvent_catchErrors status is "end"
    And @check :i element:StartEvent_catchErrors endedAt is null
    And @check :i element:BoundaryEvent_catchErrors status is "end"
    And @check :i element:BoundaryEvent_catchErrors endedAt is null

  Scenario: Error 4 (error.js)
    When @start process:"Error events" as :i
      | caseId | 7015 |
      | scenario | "Error 4" |
    And @invoke element:UserTask2 in :i
      | Require_Review | "true" |
      | Error_Code | "Error4" |
    And @check :i element:UserTask2 status is "end"
    And @check :i element:Event_error4 status is "end"
    And @check :i element:Event_catchEsclation status is "end"
    And @check :i element:Event_1e95dbp status is "end"
    And @check :i element:Event_catch_all status is "end"
    And @check :i element:StartEvent_14s2cpf status is "end"
    And @check :i element:StartEvent_14s2cpf endedAt is null
    And @check :i element:BoundaryEvent_catchErrors status is "end"
    And @check :i element:BoundaryEvent_catchErrors endedAt is null
