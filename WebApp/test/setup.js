'use strict';
console.log('test/setup.js');

process.env.NODE_ENV = 'test';
Error.stackTraceLimit = 20;
global.expect = require('chai').expect;
global.assert = require('chai').assert;



