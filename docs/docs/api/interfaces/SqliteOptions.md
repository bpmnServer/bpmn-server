[bpmn-server](../readme.md) / SqliteOptions

# Interface: SqliteOptions

## Table of contents

### Properties

- [busyTimeout](SqliteOptions.md#busytimeout)

## Properties

### busyTimeout

• `Optional` **busyTimeout**: `number`

How long a write waits for another connection's (another server's) write to end, in ms; default 5000.

#### Defined in

[packages/bpmn-server/src/datastore/SqliteDocumentStore.ts:9](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/datastore/SqliteDocumentStore.ts#L9)
