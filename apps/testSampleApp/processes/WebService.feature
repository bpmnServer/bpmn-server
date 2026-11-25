Feature: WebService
  A web service call (webService, which calls out over HTTP): stubbed here.

  Scenario: The call answers
    Given @stub service:webService with
      """javascript
      return { status: 200 };
      """
    When @start process:WebService as :i
    Then @check :i passed element:Activity_1uty3n6 with status "end"
      And @check :i status is "end"
