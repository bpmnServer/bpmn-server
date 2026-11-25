[bpmn-server](../readme.md) / IVerifyOptions

# Interface: IVerifyOptions

## Table of contents

### Properties

- [decisionsFolder](IVerifyOptions.md#decisionsfolder)
- [addOns](IVerifyOptions.md#addons)
- [manifests](IVerifyOptions.md#manifests)

## Properties

### decisionsFolder

• `Optional` **decisionsFolder**: `string`

the folder of the decision files (`<name>.dmn.xml`) business rule tasks name; the server's definitionsPath by default

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:45](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L45)

___

### addOns

• `Optional` **addOns**: [`IAddOn`](IAddOn.md)[]

the add-ons whose checks run too (engine/AddOns.ts); the server's by default, none without a server

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:47](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L47)

___

### manifests

• `Optional` **manifests**: [`IAddOnManifest`](IAddOnManifest.md)[]

every add-on's manifest, on or off, for a model that uses one that is off; the server configuration's by default

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:49](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L49)
