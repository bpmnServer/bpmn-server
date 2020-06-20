# Query

Every execution is saved in MongoDB as a document made-up mainly of Instance and Items

## Item Query

Is used to locate an item or a group of items:

```javascript
	{ instance: {<instance conditions}, items: {<item conditions}}
```
examples:

```javascript
	{ instance: {id: <instanceId> }, items: {elementId:<taskId>}}
```
Will retrieve an element(s) in this instance with specific elementId
```javascript
	{ items: {id:<itemId>}}
```
Since itemId is unique will return only one item (if exists)
```javascript
	{ items: {status:'wait'}}
```
Will return all items in the system that are in 'wait' state.

	

## Instance Query

Is used to locate an Instance or a group of instances.

examples:

```javascript
	{ id: instanceId}
```
Will retrieve an instance with the unique id
```javascript
	{ data: {caseId: 1005}}
```
Will retrieve an instance with the specified caseId
```javascript
	{ items.item.id : 'abcc111322'}	
```
Will an instance that has such an item.
