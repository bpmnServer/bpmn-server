'use strict';

process.env.NODE_ENV = 'test';
Error.stackTraceLimit = 20;
import { expect, assert } from 'chai';
global.expect = expect;
global.assert = assert;



