[bpmn-server](../README.md) / [Exports](../modules.md) / [engine/ScriptHandler](../modules/engine_ScriptHandler.md) / ScriptHandler

# Class: ScriptHandler

[engine/ScriptHandler](../modules/engine_ScriptHandler.md).ScriptHandler

## Table of contents

### Constructors

- [constructor](engine_ScriptHandler.ScriptHandler.md#constructor)

### Methods

- [evaluateExpression](engine_ScriptHandler.ScriptHandler.md#evaluateexpression)
- [evaluateInputExpression](engine_ScriptHandler.ScriptHandler.md#evaluateinputexpression)
- [executeScript](engine_ScriptHandler.ScriptHandler.md#executescript)
- [getJSvars](engine_ScriptHandler.ScriptHandler.md#getjsvars)

## Constructors

### constructor

• **new ScriptHandler**(): [`ScriptHandler`](engine_ScriptHandler.ScriptHandler.md)

#### Returns

[`ScriptHandler`](engine_ScriptHandler.ScriptHandler.md)

## Methods

### evaluateExpression

▸ **evaluateExpression**(`scope`, `expression`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scope` | `any` |
| `expression` | `any` |

#### Returns

`any`

#### Defined in

[src/engine/ScriptHandler.ts:46](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/ScriptHandler.ts#L46)

___

### evaluateInputExpression

▸ **evaluateInputExpression**(`item`, `exp`, `dateFormat?`): `Promise`\<`any`\>

*	these expression are strings with $
   * scenarios:
   *       String          =>as is
   *       $javaScript     =>evaulated
   *       a , b , c       =>array
   *       dateString      =>convert to date
   * Examples:
   *         ['T', `user1`],
       ['T', `$(appServices.test1(100))`],
       ['T', `$(appServices.getSupervisorUser('user1'))`],
       ['T', `abc,xyz,user group`],
       ['TD', `2022-10-11`],
*	
   * 
   *     appDelegate.scopeEval -->evaluateExpression
   *     appDelegate.scopeJS   -->executeScript
   *

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `item` | `any` | `undefined` |
| `exp` | `any` | `undefined` |
| `dateFormat` | `boolean` | `false` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[src/engine/ScriptHandler.ts:24](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/ScriptHandler.ts#L24)

___

### executeScript

▸ **executeScript**(`scope`, `script`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `scope` | `any` |
| `script` | `any` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[src/engine/ScriptHandler.ts:75](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/ScriptHandler.ts#L75)

___

### getJSvars

▸ **getJSvars**(`scope`): ``"\n            var data=this.data;\n            var input=this.input;\n            var output=this.output;\n            var appDelegate=this.execution.appDelegate;\n            var appServices=this.execution.servicesProvider;\n            var appUtils=appDelegate.appUtils;\n            var item=this;  // for backward support only\n            "`` \| ``"\n            var appDelegate=this.appDelegate;\n            var appServices=this.servicesProvider;\n            var appUtils=appDelegate.appUtils;\n            "`` \| ``"\n            var item=this;\n            var data=this.data;\n            var input=this.input;\n            var output=this.output;\n            var appDelegate=this.token.execution.appDelegate;\n            var appServices=this.token.execution.servicesProvider;\n            var appUtils=appDelegate.appUtils;\n            "``

#### Parameters

| Name | Type |
| :------ | :------ |
| `scope` | `any` |

#### Returns

``"\n            var data=this.data;\n            var input=this.input;\n            var output=this.output;\n            var appDelegate=this.execution.appDelegate;\n            var appServices=this.execution.servicesProvider;\n            var appUtils=appDelegate.appUtils;\n            var item=this;  // for backward support only\n            "`` \| ``"\n            var appDelegate=this.appDelegate;\n            var appServices=this.servicesProvider;\n            var appUtils=appDelegate.appUtils;\n            "`` \| ``"\n            var item=this;\n            var data=this.data;\n            var input=this.input;\n            var output=this.output;\n            var appDelegate=this.token.execution.appDelegate;\n            var appServices=this.token.execution.servicesProvider;\n            var appUtils=appDelegate.appUtils;\n            "``

#### Defined in

[src/engine/ScriptHandler.ts:116](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/ScriptHandler.ts#L116)
