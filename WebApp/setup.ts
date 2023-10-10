import { BPMNServer } from '.';

console.log('This routine will setup bpmn-server database');

const fs = require('fs');
const cwd = process.cwd();

let configuration;
const configPath = cwd + '/configuration.js';

if (fs.existsSync(configPath)) {

    configuration= require(configPath).configuration;

    install();

}
else {
    console.log(`**Error** configuration.js file does not exist in this folder '${cwd}'**`)
    console.log("please run this script from the folder containing 'configuration.js'");
}


async function install() {

    console.log('Installing a new Database');

    console.log('current directory is ' + process.cwd());
    console.log('Installing a new Database based on configuration in current directory');
    console.log('current directory is ' + process.cwd());
    console.log('database configuration:',configuration.database);

    const server = new BPMNServer(configuration, null, { cron: false });

    const dataStore = server.dataStore;

    const modelsDataStore = server.definitions;
    try {
        await dataStore.install();

        await modelsDataStore.install();

    }
    catch (exc) {
        console.log(exc);
    }

    console.log('---done.');
    process.exit();
}


