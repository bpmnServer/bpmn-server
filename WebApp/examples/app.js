'use strict';

const readline = require('readline');
const path = require('path')

console.log('Hello, welcome to BPMN-Engine Samples');

var files = []

displayFiles();

var log = console.log;

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var lastFile;

var recursiveAsyncReadLine = function () {
    console.log(`Select a file from the list or "exit" or ? for list`);
    rl.question('Command: ', function (answer) {
        if (answer == 'exit') //we need some base case, for recursion
            return rl.close(); //closing RL and returning from function.
        if (answer == '?') //we need some base case, for recursion
            displayFiles();
        log('Got it! Your answer was: "', answer, '"');

        let file = files[answer - 1];
        if (file) {
            if (lastFile)
                delete require.cache[require.resolve('./engine-samples/' + lastFile)]
            console.log(" invoking file: " + file);
            let test = require('./engine-samples/' + file);
            lastFile = file;

        }
        
        recursiveAsyncReadLine(); //Calling this function again to ask new question
    });
};

recursiveAsyncReadLine(); //we have to actually start our recursion somehow


function displayFiles() {

    console.log(__dirname);

    const testFolder = __dirname + '/engine-samples';
    const fs = require('fs');
    files = [];
    let i = 0;
    fs.readdirSync(testFolder).forEach(file => {
        if (path.extname(file) == '.js') {
            console.log("" + (++i) + " " + file);
            files.push(file);
        }
    });
}



/*


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


while ( checkInput()) { }


async function checkInput() {


readLine('testing?', function (answer) {
    // TODO: Log the answer in a database
    console.log(`Select a file from the list or "exit" ${answer}`);

    if (answer== 'exit')
        return null;

    let file = files[answer - 1];

    if (file) {
        console.log(" invoking file: " + file);
//        var sample = require('./engine-samples/' + file);

    }


    return answer;
});
}


function readLine(question, callback) {


    rl.question('What do you think of Node.js? ', (answer) => { callback(answer); });
    

}
*/
