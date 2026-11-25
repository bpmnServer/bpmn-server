Feature: test-wait-invoke
  A user task, then two services: service1, and DummyService1, which writes its result into the data.

  Scenario: The task done, both services run
    Given @stub service:service1 with
      """javascript
      return { text: 'stubbed' };
      """
    When @start process:test-wait-invoke as :i
      And @invoke element:Activity_0z113lq in :i
    Then @check :i status is "end"
      And @check :i data.service1Result is "Service1Exec"
