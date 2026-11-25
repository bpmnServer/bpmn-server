[bpmn-server](../readme.md) / IAddOnManifest

# Interface: IAddOnManifest

An add-on's manifest (`addon.json` in its folder): its name, its title, and the model attributes it reads. Read for
every add-on bpmn-server comes with, on or off, so a model using one that's off is told (verifyModel's add-on-off),
and the model report and the Settings page show its attributes.

## Table of contents

### Properties

- [name](IAddOnManifest.md#name)
- [title](IAddOnManifest.md#title)
- [description](IAddOnManifest.md#description)
- [brief](IAddOnManifest.md#brief)
- [options](IAddOnManifest.md#options)
- [partOf](IAddOnManifest.md#partof)
- [docs](IAddOnManifest.md#docs)
- [attributes](IAddOnManifest.md#attributes)
- [elements](IAddOnManifest.md#elements)
- [settings](IAddOnManifest.md#settings)

## Properties

### name

• **name**: `string`

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:51](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L51)

___

### title

• **title**: `string`

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:52](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L52)

___

### description

• `Optional` **description**: `string`

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:53](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L53)

___

### brief

• `Optional` **brief**: `string`

what it is, in a few words (its card on the Settings page)

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:55](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L55)

___

### options

• `Optional` **options**: `boolean`

its settings are its options, each switched on or off on its card (Model Options): it has no on/off of its own

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:57](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L57)

___

### partOf

• `Optional` **partOf**: `string`

one of another add-on's options (Extended Forms, Model Options'): no card of its own; on as that option says

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:59](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L59)

___

### docs

• `Optional` **docs**: `string`

its doc page: a path of the docs site (`add-ons/policies/`), or a full address for an application's own

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:61](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L61)

___

### attributes

• **attributes**: `string`[]

the model attributes it reads: `camunda:candidateGroups`, `owf:assignmentPolicy`

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:63](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L63)

___

### elements

• `Optional` **elements**: `string`[]

the model elements it reads: `owf:list`, `owf:lookup`

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:65](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L65)

___

### settings

• `Optional` **settings**: \{ `name`: `string` ; `label`: `string` ; `editor?`: ``"admin"`` \| ``"designer"`` ; `main?`: `boolean`  }[]

Its settings (the server's .env names), shown in its own area of the Settings page: `editor` designer, a designer
changes it too (else an administrator); `main`, shown first.

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:70](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L70)
