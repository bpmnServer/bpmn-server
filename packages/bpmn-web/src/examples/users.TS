const { BPMNServer, DefaultAppDelegate, Logger } = require("../");
const { configuration } = require('../configuration');


const logger = new Logger({ toConsole: false });

const server = new BPMNServer(configuration, logger);

let response;
let instanceId;

test();
enum PRIVILEGE {
    EXECUTE= 1,
    VIEW = 2,
    UPDATE=4,
    DELETE=8
}
enum RESOURCE {
    INSTANCES = 'I',
    MODELS = 'M',
    SYSTEM = 'S'
}

class User {

    grant(privs,resource:RESOURCE) {

    }
    can(operation: PRIVILEGE, resource: RESOURCE) {

    } 
    static authenticate(user, pw) {
        return new User();
    }
}
async function test() {

    const user1 = new User();
    user1.grant(PRIVILEGE.VIEW + PRIVILEGE.UPDATE, RESOURCE.INSTANCES);

    const user2 = User.authenticate('john', 'pass');

    const server = new BPMNServer(configuration);
    server.user = user1;
/*
 * 
User managements:
----------------
1. only authorized users can access the system
2.	grant specific privileges to specific users
	instances
		view	view and query instances data and items
		execute	invoke
		delete
		add		start new processes
	models
		view
		edit	model and modify
		add
		delete


 */
}
async function delay(time) {
    log("delaying ... " + time)
    return new Promise(function (resolve) {
        setTimeout(function () {
            log("delayed is done.");
            resolve();
        }, time);
    });
}
function log(msg) {
    logger.log(msg);
}
function getItem(id) {
    const item = response.items.filter(item => { return item.elementId == id; })[0]
    if (!item) {
        log('item ' + id + ' not found');
    }
    return item;
}