Feature: UserInputDataObject
  One user task whose input is a data object.

  Scenario: The task done with its input
    When @start process:UserInputDataObject as :i
      And @invoke element:Activity_04ihtpv in :i
      | UserInput | "entered" |
    Then @check :i status is "end"
      And @check :i passed element:Event_19kd4gd
