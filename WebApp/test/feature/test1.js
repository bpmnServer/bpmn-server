"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';
function hello() {
    return 'Hello World!';
}
describe('Hello function', () => {
    it('should return hello world', () => {
        const result = hello();
        chai_1.expect(result).to.equal('Hello World!');
    });
});
//# sourceMappingURL=test1.js.map