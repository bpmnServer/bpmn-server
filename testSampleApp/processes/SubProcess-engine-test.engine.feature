Feature: SubProcess-engine-test

  Scenario: All (subProcess.js)
    When @start process:SubProcess-engine-test as :i
      | caseId | 4001 |
      | task_subProcess | {"clients": ["abc", "mbc", "cbc"]} |
    And @check :i element:Task_design status is "wait"
    And @invoke element:Task_design in :i
    And @check :i element:sub_usertask_2 status is "wait"
    And @check :i has 3 items of element:sub_task_1
    And @invoke first element:sub_usertask_2 in :i
    And @check :i element:EndEvent_08zhy2j status is "end"

  Scenario: Cancel (subProcess.js)
    When @start process:SubProcess-engine-test as :i
      | caseId | 4002 |
      | task_subProcess | {"clients": ["abc", "mbc", "cbc"]} |
    And @check :i element:Task_design status is "wait"
    And @invoke element:Task_design in :i
    And @check :i element:sub_usertask_2 status is "wait"
    And @invoke first element:Event_cancel in :i
    And @check :i element:Event_0eg36vn status is "end"
    And @check :i element:task_subProcess status is "end"
    And @check :i element:task_subProcess endedAt is null
    And @check :i element:sub_usertask_2 status is "end"
    And @check :i element:sub_usertask_2 endedAt is null
