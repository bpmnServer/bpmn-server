[bpmn-server](../readme.md) / ScriptHandler

# Class: ScriptHandler

## Hierarchy

- **`ScriptHandler`**

  ↳ [`SandboxScriptHandler`](SandboxScriptHandler.md)

## Implements

- [`IScriptHandler`](../interfaces/IScriptHandler.md)

## Table of contents

### Constructors

- [constructor](ScriptHandler.md#constructor)

### Properties

- [context](ScriptHandler.md#context)

### Methods

- [contextValues](ScriptHandler.md#contextvalues)
- [evaluateCondition](ScriptHandler.md#evaluatecondition)
- [evaluateFeel](ScriptHandler.md#evaluatefeel)
- [evaluateInputExpression](ScriptHandler.md#evaluateinputexpression)
- [evaluateExpression](ScriptHandler.md#evaluateexpression)
- [executeScript](ScriptHandler.md#executescript)
- [compile](ScriptHandler.md#compile)
- [compiled](ScriptHandler.md#compiled)
- [scriptName](ScriptHandler.md#scriptname)
- [getJSvars](ScriptHandler.md#getjsvars)
- [runPython](ScriptHandler.md#runpython)

## Constructors

### constructor

• **new ScriptHandler**(`options?`): [`ScriptHandler`](ScriptHandler.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.context?` | [`ScriptContext`](../readme.md#scriptcontext) |

#### Returns

[`ScriptHandler`](ScriptHandler.md)

#### Defined in

[packages/bpmn-server/src/engine/ScriptHandler.ts:21](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/ScriptHandler.ts#L21)

## Properties

### context

• **context**: [`ScriptContext`](../readme.md#scriptcontext) = `{}`

Variables scripts and expressions see besides their own, by name. The application sets it; models can not.

#### Implementation of

[IScriptHandler](../interfaces/IScriptHandler.md).[context](../interfaces/IScriptHandler.md#context)

#### Defined in

[packages/bpmn-server/src/engine/ScriptHandler.ts:19](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/ScriptHandler.ts#L19)

## Methods

### contextValues

▸ **contextValues**(`scope`): `Record`\<`string`, `any`\>

The context's values for a scope.

#### Parameters

| Name | Type |
| :------ | :------ |
| `scope` | `any` |

#### Returns

`Record`\<`string`, `any`\>

#### Defined in

[packages/bpmn-server/src/engine/ScriptHandler.ts:29](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/ScriptHandler.ts#L29)

___

### evaluateCondition

▸ **evaluateCondition**(`scope`, `expression`, `language?`, `label?`): `Promise`\<`any`\>

A sequence flow's condition, in the language it says: FEEL when it says so, any other is JavaScript. A ${...}
around it is a wrapper, whatever the language.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `scope` | [`Token`](Token.md) \| [`Item`](Item.md) | `undefined` |
| `expression` | `any` | `undefined` |
| `language?` | `string` | `undefined` |
| `label` | `string` | `'condition'` |

#### Returns

`Promise`\<`any`\>

#### Implementation of

[IScriptHandler](../interfaces/IScriptHandler.md).[evaluateCondition](../interfaces/IScriptHandler.md#evaluatecondition)

#### Defined in

[packages/bpmn-server/src/engine/ScriptHandler.ts:40](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/ScriptHandler.ts#L40)

___

### evaluateFeel

▸ **evaluateFeel**(`scope`, `expression`): `Promise`\<`unknown`\>

A FEEL expression over the data: its values by name, and `data` itself.

#### Parameters

| Name | Type |
| :------ | :------ |
| `scope` | `any` |
| `expression` | `any` |

#### Returns

`Promise`\<`unknown`\>

#### Defined in

[packages/bpmn-server/src/engine/ScriptHandler.ts:47](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/ScriptHandler.ts#L47)

___

### evaluateInputExpression

▸ **evaluateInputExpression**(`item`, `exp`, `dateFormat?`): `Promise`\<`any`\>

*	these expression are strings with $
   * scenarios:
   *       String          =>as is
   *       $javaScript     =>evaulated ($js, $(js) or ${js})
   *       a ${js} b       =>the text, each ${js} evaluated in its place
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

[packages/bpmn-server/src/engine/ScriptHandler.ts:74](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/ScriptHandler.ts#L74)

___

### evaluateExpression

▸ **evaluateExpression**(`scope`, `expression`, `label?`): `Promise`\<`any`\>

execute JavaScript expression , no need for $

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `scope` | [`Token`](Token.md) \| [`Item`](Item.md) | `undefined` |
| `expression` | `any` | `undefined` |
| `label` | `string` | `'expression'` |

#### Returns

`Promise`\<`any`\>

#### Implementation of

[IScriptHandler](../interfaces/IScriptHandler.md).[evaluateExpression](../interfaces/IScriptHandler.md#evaluateexpression)

#### Defined in

[packages/bpmn-server/src/engine/ScriptHandler.ts:102](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/ScriptHandler.ts#L102)

___

### executeScript

▸ **executeScript**(`scope`, `script`, `label?`): `Promise`\<`any`\>

label: which script it is (an event's, a script task's): its name for debuggers and errors

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `scope` | [`Execution`](Execution.md) \| [`Item`](Item.md) | `undefined` |
| `script` | `any` | `undefined` |
| `label` | `string` | `'script'` |

#### Returns

`Promise`\<`any`\>

#### Implementation of

[IScriptHandler](../interfaces/IScriptHandler.md).[executeScript](../interfaces/IScriptHandler.md#executescript)

#### Defined in

[packages/bpmn-server/src/engine/ScriptHandler.ts:133](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/ScriptHandler.ts#L133)

___

### compile

▸ **compile**(`scope`, `body`, `label`, `names?`): `Function`

A model's script or expression as a function of its scope, named after where it is in the model
(bpmn:///<model>/<element>/<label>.js) and numbered from its own first line: a debugger lists it by that
name and stops at its breakpoints and at `debugger;`, and an error's stack says where it is.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `scope` | `any` | `undefined` |
| `body` | `string` | `undefined` |
| `label` | `string` | `undefined` |
| `names` | `string`[] | `[]` |

#### Returns

`Function`

#### Defined in

[packages/bpmn-server/src/engine/ScriptHandler.ts:187](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/ScriptHandler.ts#L187)

___

### compiled

▸ **compiled**(`scope`, `body`, `label`): `any`

Runs a script, with the context's variables as its parameters.

#### Parameters

| Name | Type |
| :------ | :------ |
| `scope` | `any` |
| `body` | `string` |
| `label` | `string` |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/engine/ScriptHandler.ts:195](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/ScriptHandler.ts#L195)

___

### scriptName

▸ **scriptName**(`scope`, `label`): `string`

bpmn:///<model>/<element>/<label>.js: the element is the item's; a process's own scripts are under 'process'.

#### Parameters

| Name | Type |
| :------ | :------ |
| `scope` | `any` |
| `label` | `string` |

#### Returns

`string`

#### Defined in

[packages/bpmn-server/src/engine/ScriptHandler.ts:200](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/ScriptHandler.ts#L200)

___

### getJSvars

▸ **getJSvars**(`scope`): ``"\n            var data=this.data;\n            var instance=this.execution.instance;\n            var input=this.input;\n            var output=this.output;\n            var appDelegate=this.execution.appDelegate;\n            var appServices=this.execution.servicesProvider;\n            var appUtils=appDelegate.appUtils;\n            var item=this;  // for backward support only\n            "`` \| ``"\n            var appDelegate=this.appDelegate;\n            var instance=this.instance;\n            var appServices=this.servicesProvider;\n            var appUtils=appDelegate.appUtils;\n            "`` \| ``"\n            var item=this;\n            var data=this.data;\n            var instance=this.token.execution.instance;\n            var input=this.input;\n            var output=this.output;\n            var appDelegate=this.token.execution.appDelegate;\n            var appServices=this.token.execution.servicesProvider;\n            var appUtils=appDelegate.appUtils;\n            "``

#### Parameters

| Name | Type |
| :------ | :------ |
| `scope` | `any` |

#### Returns

``"\n            var data=this.data;\n            var instance=this.execution.instance;\n            var input=this.input;\n            var output=this.output;\n            var appDelegate=this.execution.appDelegate;\n            var appServices=this.execution.servicesProvider;\n            var appUtils=appDelegate.appUtils;\n            var item=this;  // for backward support only\n            "`` \| ``"\n            var appDelegate=this.appDelegate;\n            var instance=this.instance;\n            var appServices=this.servicesProvider;\n            var appUtils=appDelegate.appUtils;\n            "`` \| ``"\n            var item=this;\n            var data=this.data;\n            var instance=this.token.execution.instance;\n            var input=this.input;\n            var output=this.output;\n            var appDelegate=this.token.execution.appDelegate;\n            var appServices=this.token.execution.servicesProvider;\n            var appUtils=appDelegate.appUtils;\n            "``

#### Defined in

[packages/bpmn-server/src/engine/ScriptHandler.ts:205](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/ScriptHandler.ts#L205)

___

### runPython

▸ **runPython**(`item`, `code`, `input?`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |
| `code` | `string` |
| `input` | `any` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/engine/ScriptHandler.ts:246](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/ScriptHandler.ts#L246)
