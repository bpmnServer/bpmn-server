# Load a client through a BPMN data object

Use a local [starter app](../setup.md). Add this method to the existing class in `delegates/appDelegate.ts`.
The two fields represent a client record that a real app would look up by ID.

```ts
async loadDataObject(name: string, item: Item) {
    if (name === 'client' && item.data.clientId === 'C-1') {
        return { id: 'C-1', tier: 'gold' };
    }
    return null;
}
```

1. Model **Start → Price order (script task) → Review (user task) → End**.
2. Name a data object `client` and connect **Start** to it with a data association. In the object's
   properties, confirm that the workflow field is `data.client` and that **Start** is listed as a loader.
3. In **Price order**, set `data.discount = data.client?.tier === 'gold' ? 10 : 0;`.
4. Start with `{"clientId":"C-1"}`. At **Review**, inspect the instance data. Expect
   `client: { id: 'C-1', tier: 'gold' }` and `discount: 10`. Complete **Review** and confirm that both values
   are still present.

The association tells BPMN Server when to call the delegate. The loaded record is a copy stored with the
workflow instance. The host app owns the original client record.

See [Data objects](../data-objects.md) and the
[engine test for data loading and persistence](https://github.com/bpmnServer/bpmn-server/blob/v3.5.2/packages/bpmn-server/test/data-objects.test.mjs).
