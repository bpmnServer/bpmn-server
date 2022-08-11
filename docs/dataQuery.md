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
| { "items.id": "value-of-id" }	|	find items by id only - unique |
| { id: instanceId, "items.elementId": item.elementId }	| find items by instance id and elementId 	|
| {"data.caseId": caseId  ,"items.elementId" : item.elementId }	| find items by caseId and item elementId 	|
| { "name" : "processName" , "items.status": "wait"}| find items for the process in a wait state	|
| { id: instanceId, "items.status": 'wait' }	| check for items in "wait" |
|	{"items.status": "wait" , "items.elementId": "task_Buy" }	| find all items that has "wait" status |


```javascript
         query = { "items.id": item.id };
         items = await server.dataStore.findItems(query);
```

## Instance Query

Instance Queries are similar to Items Query but return entire Instances with all the items

```javascript

        // find instances having elementId

            instances = await server.dataStore.findInstances( 
                    {
                    "items.elementId": "task_Buy"
                    });
         
        //  find instance by itemd id

            instances = await server.dataStore.findInstances(
                    {"items.id": item.id 
                    });

        // find instance by caseId

            instances = await server.dataStore.findInstances( {"data.caseId": 3030});
