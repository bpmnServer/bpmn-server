# Data objects

A data object in the diagram stands for data the process works on: a client, an order, a policy. bpmn-server
asks the application for it when an element connected to it runs, and keeps it in the instance data.

## In the model

Draw a data object, name it (`client`), and connect it to the element that needs it with a data association,
either way (input or output). Typically the start event, or the first task that needs the data.

## In the application

The application delegate loads it:

```ts
import { DefaultAppDelegate } from 'bpmn-server';

class MyAppDelegate extends DefaultAppDelegate {
    async loadDataObject(name: string, item) {
        if (name == 'client')
            return await clients.findOne({ id: item.data.clientId });
    }
}
```

`name` is the data object's name in the diagram; `item` is the element running, with the instance data in
`item.data`.

The value is put in the instance data under that name, `data.client`, and saved with the instance like any data.
Later elements read and change it: `$data.client.name` in an expression, `this.data.client` in a script.

It is loaded each time a connected element runs, after the element's `enter` and before its `start`, so the
element's own scripts already see it.

## Checks

[`verifyModel`](verify.md):

- `data-object-not-loaded`: a data object connected to nothing, so it is never loaded.
- `no-data-object-loader`: the model has data objects, but the application's delegate has no `loadDataObject`.

## Coming next: data stores

A data object is loaded into the instance and saved with it. A **data store** will stand for data the process
queries without keeping it, read where it lives each time. Until then, a data store reference connected to an
element is loaded the same way as a data object.
