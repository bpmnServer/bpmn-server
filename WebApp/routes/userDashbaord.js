"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser');
const FS = require('fs');
const __1 = require("..");
const __2 = require("..");
const UserAccessData_1 = require("../bpmnServer/src/acl/UserAccessData");
console.log(__2.docsFolder);
/* GET users listing. */
const url = 'https://raw.githubusercontent.com/ralphhanna/bpmn-server/master/';
const https = require('https');
const awaitAppDelegateFactory = (middleware) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield middleware(req, res, next);
        }
        catch (err) {
            next(err);
        }
    });
};
{
    {
        router.get('/', awaitAppDelegateFactory((request, response) => __awaiter(void 0, void 0, void 0, function* () {
            const assignments = yield UserAccessData_1.UserAccessData.find(__1.BPMNServer.getInstance(), 'user1', ['driver', 'cleaner']);
            console.log(assignments);
            response.render('userDashboard', {
                assignments: assignments
            });
        })));
    }
}
exports.default = router;
//# sourceMappingURL=userDashbaord.js.map