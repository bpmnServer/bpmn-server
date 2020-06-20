
const { Execution} = require('../index');
const { Helper , logger } = require('./helper');
var execution=null;
const I = new Helper(execution);
const run = I.run;

//testLoop();
testInvoice();

async function testInvoice() {
    const name = 'invoice';
    const source = I.getSource(name);


    I.Scenario('testing scenario 1', name, source);

    I.Step("Start", async function () {
        // ----
        execution = new Execution(name, source, null, logger);
        await execution.execute('StartEvent_0wntki2',
            { reminderCounter: 0, caseId: 1005 });

        I.expectItem('task_issue_invoice', 'wait');
        // ----
    });

    I.Step("Execute", async function () {
        // ----
        await execution.signal('task_issue_invoice', null);

        // ----
    });
    I.Step("Wait a bit", async function () {
        // ----
        await I.delay(35000, 'test');
        I.expectItem('event_cancel', 'wait');
        I.expectItem('task_got_payment', 'wait');

        // ----
    });
    I.Step("Cancel Invoice", async function () {
        // ----
        await execution.signal('event_cancel', null);

        // ----
    });

    I.Step("All done", async function () {
        // ----
        I.expectExecution('end');
        logger.save('./' + name + ".log");
    });
    run(I);
}

