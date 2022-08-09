# Data Query 

The syntax follows MongoDB standards, since instance data is saved in the format of :
```javascript
{
id;
name;
//.. other instance attributes
items: { // items here
    id;
    elementId;
    status;
    // items here
}
data: { // data attributes here}

}
the query syntax must be 
- instance attributes unqualified
- item attributes are qualified by 'items.<attributeName>'
- data attributes are qualified by 'data.<attributeName>'

```
## Item Query 


| example | will retrieve          |
| -------------|-----------|
|	 { "items.id": item.id }	|	find items by id only - unique |
|		{ id: instanceId, "items.elementId": item.elementId }	| find items by instance id and elementId 	|
|	{"data.caseId": caseId  ,"items.**elementId**" : item.elementId }	| find items by caseId and item elementId 	|
|		{ id: instanceId, "items.status": 'wait' }	| check for items in "wait" |
|		{"items.status": 'wait' }	| find all items that has "wait" status |

```javascript
        and('find items by item id only', async () => {

            query = { "items.id": item.id };
            items = await server.dataStore.findItems(query);
            checkItem(items, { id: item.id });
        });
        and('find items by instance and item elemetnId ', async () => {

            query = { id: instanceId, "items.elementId": item.elementId };
            items = await server.dataStore.findItems(query);
            checkItem(items, { id: item.id });
        });

        and('find items by caseId and item elementId ', async () => {

            query = {"data.caseId": caseId  ,"items.elementId" : item.elementId };
            items = await server.dataStore.findItems(query);
            checkItem(items, { id: item.id });
        });


        and('check for items "wait" ', async () => {

            query = { id: instanceId, "items.status": 'wait' };
            items = await server.dataStore.findItems(query);
            checkItem(items, { status: 'wait' });
      });
```

## Instance Query
```javascript

        and('find instance by instance id only', async () => {

            query = { id: response.execution.id };
            instances = await server.dataStore.findInstances(query);
            checkInstance(instances, { id: response.execution.id });

        });

        and('find instance by itemd id ', async () => {

            query = {"items.id": item.id };
            instances = await server.dataStore.findInstances(query);
            checkInstance(instances, { id: response.execution.id });

        });


        and('find instance by caseId', async () => {

            query = {
                data: { caseId: caseId }};
            instances = await server.dataStore.findInstances(query);
            checkInstance(instances, { id: response.execution.id  });

        });


