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

[packages/bpmn-server/src/interfaces/DataObjects.ts:58](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L58)

___

### savePoints

• `Optional` **savePoints**: `boolean`

a save point at each save, so engine.restart can go back to any of its items (dataStore.enableSavePoints)

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:60](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L60)

___

### saveLogs

• `Optional` **saveLogs**: `boolean`

its log lines kept and saved (dataStore.saveLogs)

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:62](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L62)

___

### only

• `Optional` **only**: `string`

the one element it runs: started at it (engine.start's startNodeId), it ends when that element is done

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:64](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L64)
