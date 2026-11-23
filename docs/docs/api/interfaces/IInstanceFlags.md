[bpmn-server](../readme.md) / IInstanceFlags

# Interface: IInstanceFlags

An instance's own settings, given to engine.start (options.flags) and saved with it; unset, the data store's apply.

## Table of contents

### Properties

- [stubbed](IInstanceFlags.md#stubbed)
- [savePoints](IInstanceFlags.md#savepoints)
- [saveLogs](IInstanceFlags.md#savelogs)
- [only](IInstanceFlags.md#only)

## Properties

### stubbed

• `Optional` **stubbed**: `string`[]

Services a test stubbed for this instance: they stay uncalled if it outlives the test.

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:60](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/DataObjects.ts#L60)

___

### savePoints

• `Optional` **savePoints**: `boolean`

a save point at each save, so engine.restart can go back to any of its items (dataStore.enableSavePoints)

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:62](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/DataObjects.ts#L62)

___

### saveLogs

• `Optional` **saveLogs**: `boolean`

its log lines kept and saved (dataStore.saveLogs)

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:64](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/DataObjects.ts#L64)

___

### only

• `Optional` **only**: `string`

the one element it runs: started at it (engine.start's startNodeId), it ends when that element is done

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:66](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/DataObjects.ts#L66)
