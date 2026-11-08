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

[packages/bpmn-server/src/datastore/SqliteDocumentStore.ts:9](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/SqliteDocumentStore.ts#L9)
