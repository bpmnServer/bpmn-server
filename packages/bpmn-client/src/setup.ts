#!/usr/bin/env node
import * as fs from 'fs';
import * as readline from 'readline';
const cl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });
const question = function (q) {
    return new Promise((res, rej) => {
        cl.question(q, answer => {
            res(answer);
        });
    });
};
console.log('This routine will create .env file');
const cwd = process.cwd();
createEnv();
function createEnv() {
    if (!fs.existsSync('.env')) {
        fs.appendFileSync('.env', "API_KEY = 12345 \nHOST = localhost\nPORT = 3000\nBASE_URL = api");
        console.log(`file ".env" created.`);
    }
    else
        console.log('.env file already exists.');
    process.exit();
}
