const moddleOptions =
{
  "name": "Node bpmn-engine",
  "uri": "http://camunda.org/schema/1.0/bpmn",
  "prefix": "camunda",
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
          }]
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
          }    ]
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
        },
        {
          "name": "Assignable",
          "extends": [ "bpmn:UserTask" ],
          "properties": [
            {
              "name": "assignee",
              "isAttr": true,
              "type": "String"
            },
            {
              "name": "candidateUsers",
              "isAttr": true,
              "type": "String"
            },
            {
              "name": "candidateGroups",
              "isAttr": true,
              "type": "String"
            },
            {
              "name": "dueDate",
              "isAttr": true,
              "type": "String"
            },
            {
              "name": "followUpDate",
              "isAttr": true,
              "type": "String"
            },
            {
              "name": "priority",
              "isAttr": true,
              "type": "String"
            }
          ]
        },
        {
          "name": "FormData",
          "superClass": [ "Element" ],
          "meta": {
            "allowedIn": [
              "bpmn:StartEvent",
              "bpmn:UserTask"
            ]
          },
          "properties": [
            {
              "name": "fields",
              "type": "FormField",
              "isMany": true
            },
            {
              "name": "businessKey",
              "type": "String",
              "isAttr": true
            }
          ]
        },{
          "name": "FormField",
          "superClass": [ "Element" ],
          "properties": [
            {
              "name": "id",
              "type": "String",
              "isAttr": true
            },
            {
              "name": "label",
              "type": "String",
              "isAttr": true
            },
            {
              "name": "type",
              "type": "String",
              "isAttr": true
            },
            {
              "name": "datePattern",
              "type": "String",
              "isAttr": true
            },
            {
              "name": "defaultValue",
              "type": "String",
              "isAttr": true
            },
            {
              "name": "properties",
              "type": "Properties"
            },
            {
              "name": "validation",
              "type": "Validation"
            },
            {
              "name": "values",
              "type": "Value",
              "isMany": true
            }
          ]
        },
        {
      "name": "FormField",
      "superClass": [ "Element" ],
      "properties": [
        {
          "name": "id",
          "type": "String",
          "isAttr": true
        },
        {
          "name": "label",
          "type": "String",
          "isAttr": true
        },
        {
          "name": "type",
          "type": "String",
          "isAttr": true
        },
        {
          "name": "datePattern",
          "type": "String",
          "isAttr": true
        },
        {
          "name": "defaultValue",
          "type": "String",
          "isAttr": true
        },
        {
          "name": "properties",
          "type": "Properties"
        },
        {
          "name": "validation",
          "type": "Validation"
        },
        {
          "name": "values",
          "type": "Value",
          "isMany": true
        }
      ]
    },
    ]
};

export {moddleOptions}