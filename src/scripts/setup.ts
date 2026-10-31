import * as fs from 'node:fs';
import * as readline from 'node:readline';
import {UserService } from '../userAccess/UserService'

const cl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });

const question = function (q) {
    return new Promise((res, rej) => {
        cl.question(q, answer => {
            res(answer);
        })
    });
};
main();
async function main() {

    console.log('This routine will copy initial files and setup bpmn-server database');


    const ret = await copyFiles();
    if (ret)   // created an .env file
    {
        console.log(' setup is not complete....');
        console.log('------------------------------------------------------------------');
        console.log('Please edit ".env" file to point to your MongoDB');
        console.log('Once complete editing the .env file, please run setup one more time to complete process.')
        console.log('------------------------------------------------------------------');

    }
    else {
            const server=await install();

    }

    process.exit();

}

async function promptForEdit() {
    let command = await question('Please edit ".env" file to point to your MongoDB commands\n\r> Press Enter when done.');
    console.log(' continue...');
    return command;
}

function copyFiles() {
    const ret=copyFile('INSTALL.env', '.env');
    copyFile('./src/sample-app/INSTALL_configuration.ts', './src/sample-app/configuration.ts');
    copyFile('./src/sample-app/INSTALL_appDelegate.ts', './src/sample-app/appDelegate.ts');
//    copyFile('./sample-app/INSTALL_appDelegate.js', './sample-app/appDelegate.js');

    return ret;
}
function copyFile(from, to) {
    if (!fs.existsSync(to)) {
        fs.copyFileSync(from, to);
        console.log(`file ${to} created.`);
        return true;
    }
    return false;
}

async function install() {

    
    // the application's configuration, and bpmn-server (re-exported)
    const pack = await import('../sample-app/index.js');

    console.log('Installing a new Database');

    console.log('current directory is ' + process.cwd());
    console.log('Installing a new Database based on configuration in current directory');
    console.log('current directory is ' + process.cwd());
    console.log('database configuration:',pack.configuration.database);

    const server = new pack.BPMNServer(pack.configuration, null, { cron: false });

    const dataStore = server.dataStore;

    const modelsDataStore = server.definitions;
    try {
        await dataStore.install();

        await modelsDataStore.install();

        let userService=new UserService();

        await userService.install();
    }
    catch (exc) {
        console.log(exc);
    }

    console.log('---done.');
    return server;

}
//  upgrade logic 


async function docModels(server) {


    let models = await server.definitions.getList({});
    let note = 
`

UPGRADE WARNING: Listing of Potential invalid expressions:
------------------------------------------------------------
    If you are upgrading from an earlier release, Please note: bpmn-server release 2.0.0 and higher requires all script expression to start with $
    Older releases can have expression like this:
        data.val1==5
    now:
        $data.val1==5
    or if you prefer
        $(data.val1==5)

    This report lists all expression scripts for models in your installation
    Please verify that they have the correct syntax
    We recommend to make a backup of our models folder location at ${server.configuration.definitionsPath}

------------------------------------------------------------------------------------------------------
    `;
    let text=note;
    let modelsCount=0;
    for (let i = 0; i < models.length; i++) {
        let model = models[i];
        let docs = await docModel(server,model.name);
        if (docs.size > 0) {
            modelsCount++;
            text+=('\n\nModel:' + model.name + '\n');
            docs.forEach((list,node ) => {
                text+=('\n\t Element:' + node);
                list.forEach(item => {
                    text +=('\n\t\t' + item.type+'\n\t\t'+item.text);
                    if (item.value) {
                        text +=('\n\t\t\t' + item.value);
                    }
                });

            });
        }
    }
    fs.writeFileSync('./upgrade.log',text);
    console.log(note);
    console.log(
`       there are ${modelsCount} models that can be impacted
        log file was written to 'upgrade.log'
     if this is a new install, please ignore this message`);

}

async function docModel(server,name) {
    let model = await server.definitions.load(name);

    let docs = new Map();

    //init 
    model.nodes.forEach(node => {
        node.init();
        node.behaviours.forEach(behav => behav.init());
    })

    model.nodes.forEach(node => {
        //console.log(node.type, node.id, node.subType);

        switch (node.type) {
            case 'bpmn:SequenceFlow':
                const exp = node.def.conditionExpression;
                if (exp) {
                    docItem(docs,node,'condition',exp.body)
                }
                break;
            default:
                break;

        }


        node.behaviours.forEach(behav => {


            switch (behav.constructor.name) {
                case 'LoopBehaviour':
                    docItem(docs, node, 'Loop', behav.collection);
                    break;
                case 'IOBehaviour':
                    behav.parameters.forEach(param => {
                        docItem(docs, node, 'Parameter',  param.name, JSON.stringify(param.value));
                    });

                    
                    break;
            }
        });
    });

    return docs;

}
function docItem(docs, node, type, text, value=null) {
    
    let docNode = docs.get(node.id);
    if (!docNode)
        docs.set(node.id, []);

    let list = docs.get(node.id);
    let item = { type, text };
    if (value)
        item['value'] = value;
    list.push(item);
}
function report(instance) {
    instance.items.forEach(item => {
        console.log('--item', item.seq, item.elementId, item.type, item.status, item.userName, item.assignee, item.candidateUsers, item.candidateGroups, item.dueDate);
    });
}
