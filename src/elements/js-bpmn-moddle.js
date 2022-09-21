"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moddleOptions = void 0;
const moddleOptions = {
    "name": "Node bpmn-engine",
    "uri": "http://paed01.github.io/bpmn-engine/schema/2017/08/bpmn",
    "prefix": "js",
    "xml": {
        "tagAlias": "lowerCase"
    },
    "types": [
        {
            "name": "Task",
            "isAbstract": true,
            "extends": ["bpmn:Task"],
            "properties": [
                {
                    "name": "result",
                    "isAttr": true,
                    "type": "String"
                }
            ]
        },
        {
            "name": "Output",
            "superClass": ["Element"]
        },
        {
            "name": "Collectable",
            "isAbstract": true,
            "extends": ["bpmn:MultiInstanceLoopCharacteristics"],
            "properties": [
                {
                    "name": "collection",
                    "isAttr": true,
                    "type": "String"
                },
                {
                    "name": "elementVariable",
                    "isAttr": true,
                    "type": "String"
                }
            ]
        },
        {
            "name": "FormSupported",
            "isAbstract": true,
            "extends": [
                "bpmn:StartEvent",
                "bpmn:UserTask"
            ],
            "properties": [
                {
                    "name": "camunda:formKey",
                    "isAttr": true,
                    "type": "String"
                }
            ]
        },
        {
            "name": "SendCall",
            "isAbstract": true,
            "extends": [
                "bpmn:SendTask"
            ],
            "properties": [
                {
                    "name": "camunda:delegateExpression",
                    "isAttr": true,
                    "type": "String"
                }
            ]
        },
        {
            "name": "ServiceCall",
            "isAbstract": true,
            "extends": [
                "bpmn:ServiceTask"
            ],
            "properties": [
                {
                    "name": "camunda:delegateExpression",
                    "isAttr": true,
                    "type": "String"
                }
            ]
        }
    ]
};
exports.moddleOptions = moddleOptions;
//# sourceMappingURL=js-bpmn-moddle.js.map