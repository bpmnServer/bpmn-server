const { BPMNServer , DefaultAppDelegate , Logger } = require("./");
const { configuration } = require('./configuration');


const logger = new Logger({ toConsole: false });

const server = new BPMNServer(configuration, logger);

    recover();

async function recover() {
        var query = { "items.status": "start" };

        var list = await server.dataStore.findItems(query);
        console.log('recovering...',list.length);
        if (list.length > 0) {

            console.log("items to recover: " + list.length);
            for (var i = 0; i < list.length; i++) {
                let item = list[i];
                if (item.type=='bpmn:ScriptTask' || item.type=='bpmn:ServiceTask' )
                {
                    console.log(item.processName,item.elementId,item.type,item.startedAt,item.status);
                    console.log('recovering',item.data);
                    let response =await server.engine.invoke({"items.id":item.id}, {},null, {recover:true});
                }
                else
                    console.log('-->',item.processName,item.elementId,item.type,item.startedAt,item.status);

            }
        console.log('recovering is complete');
        }
        else 
            console.log('nothing to recover');

    process.exit();

}
