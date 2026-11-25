[bpmn-server](../readme.md) / IFormLookup

# Interface: IFormLookup

## Table of contents

### Properties

- [kind](IFormLookup.md#kind)
- [source](IFormLookup.md#source)
- [sourceText](IFormLookup.md#sourcetext)
- [text](IFormLookup.md#text)
- [key](IFormLookup.md#key)
- [display](IFormLookup.md#display)
- [filter](IFormLookup.md#filter)
- [filterInput](IFormLookup.md#filterinput)
- [items](IFormLookup.md#items)

## Properties

### kind

• **kind**: [`LookupKind`](../readme.md#lookupkind)

#### Defined in

[packages/bpmn-server/src/addons/forms/FormLookup.ts:30](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/forms/FormLookup.ts#L30)

___

### source

• **source**: \{ `type`: ``"service"`` ; `name`: `string`  } \| \{ `type`: ``"connector"`` ; `operation`: `string`  }

where the choices come from

#### Defined in

[packages/bpmn-server/src/addons/forms/FormLookup.ts:32](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/forms/FormLookup.ts#L32)

___

### sourceText

• **sourceText**: `string`

as written in the model

#### Defined in

[packages/bpmn-server/src/addons/forms/FormLookup.ts:34](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/forms/FormLookup.ts#L34)

___

### text

• `Optional` **text**: `string`

a connector's input that takes the text typed (a lookup's)

#### Defined in

[packages/bpmn-server/src/addons/forms/FormLookup.ts:36](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/forms/FormLookup.ts#L36)

___

### key

• **key**: `string`

#### Defined in

[packages/bpmn-server/src/addons/forms/FormLookup.ts:37](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/forms/FormLookup.ts#L37)

___

### display

• **display**: `string`

#### Defined in

[packages/bpmn-server/src/addons/forms/FormLookup.ts:38](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/forms/FormLookup.ts#L38)

___

### filter

• `Optional` **filter**: `string`

more criteria: a data path, `${data.department}`

#### Defined in

[packages/bpmn-server/src/addons/forms/FormLookup.ts:40](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/forms/FormLookup.ts#L40)

___

### filterInput

• `Optional` **filterInput**: `string`

a connector's input that takes the filter

#### Defined in

[packages/bpmn-server/src/addons/forms/FormLookup.ts:42](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/forms/FormLookup.ts#L42)

___

### items

• `Optional` **items**: `string`

the rows' path in the answer

#### Defined in

[packages/bpmn-server/src/addons/forms/FormLookup.ts:44](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/forms/FormLookup.ts#L44)
