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
- [reads](ScriptHandler.md#reads)

### Methods

- [standardValues](ScriptHandler.md#standardvalues)
- [namesRead](ScriptHandler.md#namesread)
- [executionOf](ScriptHandler.md#executionof)
- [appVarsOf](ScriptHandler.md#appvarsof)
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

[packages/bpmn-server/src/engine/ScriptHandler.ts:24](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ScriptHandler.ts#L24)

## Properties

### context

• **context**: [`ScriptContext`](../readme.md#scriptcontext) = `{}`

Variables scripts and expressions see besides their own, by name. The application sets it; models can not.

#### Implementation of

[IScriptHandler](../interfaces/IScriptHandler.md).[context](../interfaces/IScriptHandler.md#context)

#### Defined in

[packages/bpmn-server/src/engine/ScriptHandler.ts:22](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ScriptHandler.ts#L22)

___

### reads

▪ `Static` `Private` **reads**: `Map`\<`string`, `Set`\<`string`\>\>

#### Defined in

[packages/bpmn-server/src/engine/ScriptHandler.ts:49](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ScriptHandler.ts#L49)

## Methods

### standardValues

▸ **standardValues**(`scope`, `materialized?`): `Record`\<`string`, `any`\>

The names every expression sees besides the scope's own (docs/design/expressions.md): `user` (the operation's,
by name), and the add-ons' names for the item's place (engine/AddOns.ts: the policies' add-ons' `actors`). An
application's script context of the same name is used instead. `materialized`: plain values, for the sandbox.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `scope` | `any` | `undefined` |
| `materialized` | `boolean` | `false` |

#### Returns

`Record`\<`string`, `any`\>

#### Defined in

[packages/bpmn-server/src/engine/ScriptHandler.ts:36](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ScriptHandler.ts#L36)

___

### namesRead

▸ **namesRead**(`body`): `Set`\<`string`\>

The names a script reads without declaring them (Expressions.freeNames), remembered by its text.

#### Parameters

| Name | Type |
| :------ | :------ |
| `body` | `string` |

#### Returns

`Set`\<`string`\>

#### Defined in

[packages/bpmn-server/src/engine/ScriptHandler.ts:51](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ScriptHandler.ts#L51)

___

### executionOf

▸ **executionOf**(`scope`): `any`

The execution a scope (an item, a token, an execution) is of.

#### Parameters

| Name | Type |
| :------ | :------ |
| `scope` | `any` |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/engine/ScriptHandler.ts:62](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ScriptHandler.ts#L62)

___

### appVarsOf

▸ **appVarsOf**(`scope`, `text`): `Promise`\<`Record`\<`string`, `any`\>\>

The application's variables a text reads (appVars.<name>, docs/design/app-contract.md §2.1), worked out before it
runs: the delegate's getAppVars, made from this evaluation's context (its data, user, instance, item, and what is
evaluating: `evaluatingSource`). None read: none asked.

#### Parameters

| Name | Type |
| :------ | :------ |
| `scope` | `any` |
| `text` | `string` |

#### Returns

`Promise`\<`Record`\<`string`, `any`\>\>

#### Defined in

[packages/bpmn-server/src/engine/ScriptHandler.ts:73](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ScriptHandler.ts#L73)

___

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

[packages/bpmn-server/src/engine/ScriptHandler.ts:94](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ScriptHandler.ts#L94)

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

[packages/bpmn-server/src/engine/ScriptHandler.ts:105](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ScriptHandler.ts#L105)

___

### evaluateFeel

▸ **evaluateFeel**(`scope`, `expression`): `Promise`\<`unknown`\>

A FEEL expression, with the names every expression sees (docs/design/expressions.md): the data's fields by name,
`data`, `this` and `item`, `instance`, `input`, `output`, `actors`, `user`, `appServices`. A call to an async
service, as the whole expression, is awaited.

#### Parameters

| Name | Type |
| :------ | :------ |
| `scope` | `any` |
| `expression` | `any` |

#### Returns

`Promise`\<`unknown`\>

#### Defined in

[packages/bpmn-server/src/engine/ScriptHandler.ts:116](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ScriptHandler.ts#L116)

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

[packages/bpmn-server/src/engine/ScriptHandler.ts:155](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ScriptHandler.ts#L155)

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

[packages/bpmn-server/src/engine/ScriptHandler.ts:183](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ScriptHandler.ts#L183)

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

[packages/bpmn-server/src/engine/ScriptHandler.ts:214](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ScriptHandler.ts#L214)

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

[packages/bpmn-server/src/engine/ScriptHandler.ts:268](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ScriptHandler.ts#L268)

___

### compiled

▸ **compiled**(`scope`, `body`, `label`): `Promise`\<`any`\>

Runs a script, with the context's variables as its parameters.

#### Parameters

| Name | Type |
| :------ | :------ |
| `scope` | `any` |
| `body` | `string` |
| `label` | `string` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/engine/ScriptHandler.ts:276](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ScriptHandler.ts#L276)

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

[packages/bpmn-server/src/engine/ScriptHandler.ts:286](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ScriptHandler.ts#L286)

___

### getJSvars

▸ **getJSvars**(`scope`): ``"\n            var data=this.data;\n            var instance=this.execution.instance;\n            var input=this.input;\n            var output=this.output;\n            var appDelegate=this.execution.appDelegate;\n            var appServices=this.execution.servicesProvider;\n            var appUtils=appDelegate.appUtils;\n            var item=this;  // for backward support only\n            "`` \| ``"\n            var appDelegate=this.appDelegate;\n            var instance=this.instance;\n            var data=this.instance.data;      // a process's own script: the instance's data, at the top\n            var appServices=this.servicesProvider;\n            var appUtils=appDelegate.appUtils;\n            "`` \| ``"\n            var item=this;\n            var data=this.data;\n            var instance=this.token.execution.instance;\n            var input=this.input;\n            var output=this.output;\n            var appDelegate=this.token.execution.appDelegate;\n            var appServices=this.token.execution.servicesProvider;\n            var appUtils=appDelegate.appUtils;\n            "``

#### Parameters

| Name | Type |
| :------ | :------ |
| `scope` | `any` |

#### Returns

``"\n            var data=this.data;\n            var instance=this.execution.instance;\n            var input=this.input;\n            var output=this.output;\n            var appDelegate=this.execution.appDelegate;\n            var appServices=this.execution.servicesProvider;\n            var appUtils=appDelegate.appUtils;\n            var item=this;  // for backward support only\n            "`` \| ``"\n            var appDelegate=this.appDelegate;\n            var instance=this.instance;\n            var data=this.instance.data;      // a process's own script: the instance's data, at the top\n            var appServices=this.servicesProvider;\n            var appUtils=appDelegate.appUtils;\n            "`` \| ``"\n            var item=this;\n            var data=this.data;\n            var instance=this.token.execution.instance;\n            var input=this.input;\n            var output=this.output;\n            var appDelegate=this.token.execution.appDelegate;\n            var appServices=this.token.execution.servicesProvider;\n            var appUtils=appDelegate.appUtils;\n            "``

#### Defined in

[packages/bpmn-server/src/engine/ScriptHandler.ts:291](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ScriptHandler.ts#L291)

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

[packages/bpmn-server/src/engine/ScriptHandler.ts:333](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ScriptHandler.ts#L333)
