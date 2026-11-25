[bpmn-server](../readme.md) / SandboxScriptHandler

# Class: SandboxScriptHandler

Runs a model's scripts and expressions in a sandbox: QuickJS (a JavaScript engine compiled to WebAssembly), with
no access to Node.js, the file system, the network or the server's objects, a memory limit and a time limit.
For servers that run models written by people they do not trust (a public demo):

    scriptHandler: () => new SandboxScriptHandler()

A script gets copies of what the server's scripts get (`data`, `item`, `input`, `output`, `instance`; `this` is
`item`) as plain JSON values. What it changes in `data`, `input`, `output` and the item's assignment fields
(assignee, candidateUsers, ...) is copied back. `appServices` and `appUtils` are there, but calling one of their
methods runs nothing: it returns undefined and the run's decisions say so. There is no `appDelegate`, no
`require`, no `process`, no timers; `$py` scripts are refused.

With `callServices`, calling a method of `appServices` or `appUtils` runs it, in the server, with JSON copies of
its arguments, and the script gets a JSON copy of what it returns. Whoever writes a model can then call every one
of those methods with any arguments, so they must be safe to be called so. Only methods are reached, and only
through plain objects: not a service's other objects (its appDelegate), nor what every object inherits.

## Hierarchy

- [`ScriptHandler`](ScriptHandler.md)

  ↳ **`SandboxScriptHandler`**

## Table of contents

### Constructors

- [constructor](SandboxScriptHandler.md#constructor)

### Properties

- [timeLimit](SandboxScriptHandler.md#timelimit)
- [memoryLimit](SandboxScriptHandler.md#memorylimit)
- [callServices](SandboxScriptHandler.md#callservices)
- [context](SandboxScriptHandler.md#context)

### Methods

- [evaluateExpression](SandboxScriptHandler.md#evaluateexpression)
- [executeScript](SandboxScriptHandler.md#executescript)
- [standardFor](SandboxScriptHandler.md#standardfor)
- [run](SandboxScriptHandler.md#run)
- [standardValues](SandboxScriptHandler.md#standardvalues)
- [namesRead](SandboxScriptHandler.md#namesread)
- [executionOf](SandboxScriptHandler.md#executionof)
- [appVarsOf](SandboxScriptHandler.md#appvarsof)
- [contextValues](SandboxScriptHandler.md#contextvalues)
- [evaluateCondition](SandboxScriptHandler.md#evaluatecondition)
- [evaluateFeel](SandboxScriptHandler.md#evaluatefeel)
- [evaluateInputExpression](SandboxScriptHandler.md#evaluateinputexpression)
- [compile](SandboxScriptHandler.md#compile)
- [scriptName](SandboxScriptHandler.md#scriptname)
- [getJSvars](SandboxScriptHandler.md#getjsvars)
- [runPython](SandboxScriptHandler.md#runpython)

## Constructors

### constructor

• **new SandboxScriptHandler**(`options?`): [`SandboxScriptHandler`](SandboxScriptHandler.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.timeLimit?` | `number` |
| `options.memoryLimit?` | `number` |
| `options.callServices?` | `boolean` |
| `options.context?` | [`ScriptContext`](../readme.md#scriptcontext) |

#### Returns

[`SandboxScriptHandler`](SandboxScriptHandler.md)

#### Overrides

[ScriptHandler](ScriptHandler.md).[constructor](ScriptHandler.md#constructor)

#### Defined in

[packages/bpmn-server/src/engine/SandboxScriptHandler.ts:33](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/SandboxScriptHandler.ts#L33)

## Properties

### timeLimit

• **timeLimit**: `number` = `200`

Milliseconds a script or expression may run.

#### Defined in

[packages/bpmn-server/src/engine/SandboxScriptHandler.ts:27](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/SandboxScriptHandler.ts#L27)

___

### memoryLimit

• **memoryLimit**: `number`

Bytes a script may use.

#### Defined in

[packages/bpmn-server/src/engine/SandboxScriptHandler.ts:29](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/SandboxScriptHandler.ts#L29)

___

### callServices

• **callServices**: `boolean` = `false`

Calling a method of appServices or appUtils runs it (else it runs nothing, and the run's decisions say so).

#### Defined in

[packages/bpmn-server/src/engine/SandboxScriptHandler.ts:31](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/SandboxScriptHandler.ts#L31)

___

### context

• **context**: [`ScriptContext`](../readme.md#scriptcontext) = `{}`

Variables scripts and expressions see besides their own, by name. The application sets it; models can not.

#### Inherited from

[ScriptHandler](ScriptHandler.md).[context](ScriptHandler.md#context)

#### Defined in

[packages/bpmn-server/src/engine/ScriptHandler.ts:22](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ScriptHandler.ts#L22)

## Methods

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

#### Overrides

[ScriptHandler](ScriptHandler.md).[evaluateExpression](ScriptHandler.md#evaluateexpression)

#### Defined in

[packages/bpmn-server/src/engine/SandboxScriptHandler.ts:38](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/SandboxScriptHandler.ts#L38)

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

#### Overrides

[ScriptHandler](ScriptHandler.md).[executeScript](ScriptHandler.md#executescript)

#### Defined in

[packages/bpmn-server/src/engine/SandboxScriptHandler.ts:44](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/SandboxScriptHandler.ts#L44)

___

### standardFor

▸ **standardFor**(`scope`, `body`): `Record`\<`string`, `any`\>

The standard names (ScriptHandler.standardValues) the script reads, as plain values.

#### Parameters

| Name | Type |
| :------ | :------ |
| `scope` | `any` |
| `body` | `string` |

#### Returns

`Record`\<`string`, `any`\>

#### Defined in

[packages/bpmn-server/src/engine/SandboxScriptHandler.ts:51](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/SandboxScriptHandler.ts#L51)

___

### run

▸ **run**(`scope`, `body`, `label`): `Promise`\<`any`\>

Runs a function body against copies of the scope's values; copies back what it changed; returns its value.

#### Parameters

| Name | Type |
| :------ | :------ |
| `scope` | `any` |
| `body` | `string` |
| `label` | `string` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/engine/SandboxScriptHandler.ts:58](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/SandboxScriptHandler.ts#L58)

___

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

#### Inherited from

[ScriptHandler](ScriptHandler.md).[standardValues](ScriptHandler.md#standardvalues)

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

#### Inherited from

[ScriptHandler](ScriptHandler.md).[namesRead](ScriptHandler.md#namesread)

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

#### Inherited from

[ScriptHandler](ScriptHandler.md).[executionOf](ScriptHandler.md#executionof)

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

#### Inherited from

[ScriptHandler](ScriptHandler.md).[appVarsOf](ScriptHandler.md#appvarsof)

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

#### Inherited from

[ScriptHandler](ScriptHandler.md).[contextValues](ScriptHandler.md#contextvalues)

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

#### Inherited from

[ScriptHandler](ScriptHandler.md).[evaluateCondition](ScriptHandler.md#evaluatecondition)

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

#### Inherited from

[ScriptHandler](ScriptHandler.md).[evaluateFeel](ScriptHandler.md#evaluatefeel)

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

#### Inherited from

[ScriptHandler](ScriptHandler.md).[evaluateInputExpression](ScriptHandler.md#evaluateinputexpression)

#### Defined in

[packages/bpmn-server/src/engine/ScriptHandler.ts:155](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ScriptHandler.ts#L155)

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

#### Inherited from

[ScriptHandler](ScriptHandler.md).[compile](ScriptHandler.md#compile)

#### Defined in

[packages/bpmn-server/src/engine/ScriptHandler.ts:268](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ScriptHandler.ts#L268)

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

#### Inherited from

[ScriptHandler](ScriptHandler.md).[scriptName](ScriptHandler.md#scriptname)

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

#### Inherited from

[ScriptHandler](ScriptHandler.md).[getJSvars](ScriptHandler.md#getjsvars)

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

#### Inherited from

[ScriptHandler](ScriptHandler.md).[runPython](ScriptHandler.md#runpython)

#### Defined in

[packages/bpmn-server/src/engine/ScriptHandler.ts:333](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ScriptHandler.ts#L333)
