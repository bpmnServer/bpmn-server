Feature: Error events

  Scenario: Scenario 1
    When @start process:"Error events" as :instance
    And @invoke element:UserTask2 in :instance
      | Require_Review | "" |
      | Error_Code | "" |

  Scenario: Reach Handle Error 1 (Task_handle_error1)
    When @start process:"Error events" as :instance
      | var1 | 1 |

  @generated
  Scenario: Path to Handle Error 1
    When @start process:"Error events" as :instance
    And @invoke element:Event_catchEsclation in :instance
    And @invoke element:UserTask2 in :instance
      | Require_Review | "" |
      | Error_Code | "Error1" |

  @generated
  Scenario: Path to Handle Error 2
    When @start process:"Error events" as :instance
    And @invoke element:UserTask2 in :instance
      | Require_Review | "" |
      | Error_Code | "Error2" |

  @generated
  Scenario: Path to Error Handler 3
    When @start process:"Error events" as :instance
    And @invoke element:UserTask2 in :instance
      | Require_Review | "" |
      | Error_Code | "Error3" |

  @generated
  Scenario: Path to throw error4
    When @start process:"Error events" as :instance
    And @invoke element:UserTask2 in :instance
      | Require_Review | "" |
      | Error_Code | "Error4" |

  @generated
  Scenario: Path to Escalation_Request_Review
    When @start process:"Error events" as :instance
    And @invoke element:UserTask2 in :instance
      | Require_Review | "true" |
      | Error_Code | "" |

  Scenario: Reach Throw Error 1 (EndEvent_error1)
    When @start process:"Error events" as :instance
      | var1 | 1 |
