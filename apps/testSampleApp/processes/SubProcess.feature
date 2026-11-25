Feature: SubProcess
  Design a campaign, then a subprocess for each client: emails sent by a script for each, then one follow-up.

  Scenario: The campaign designed, each client followed up, then finalized
    When @start process:SubProcess as :i
    Then @check :i data.clients is ["a","b","c"]
    When @invoke element:Task_design in :i
    Then @check :i has 3 items of element:sub_task_1 with status "end"
      And @check :i last element:sub_usertask_2 status is "wait"
    When @invoke element:sub_usertask_2 in :i
    Then @check :i passed element:Activity_0hrqkhp with status "end"
      And @check :i status is "end"
      And @check :i passed element:EndEvent_08zhy2j
