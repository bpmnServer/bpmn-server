'use strict';

process.env.NODE_ENV = 'test';
Error.stackTraceLimit = 20;
global.expect = require('chai').expect;
global.assert = require('chai').assert;

const nock = require('nock');
nock.enableNetConnect(/(localhost|127\.0\.0\.1):\d+/);


