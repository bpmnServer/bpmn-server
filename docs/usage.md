# Usage

## Folder Structure

## Data Structure

## Data Query

filter:

```json
{ "items.type": "bpmn:StartEvent", "name": "Buy Used Car" }
```

projection:

```json
{ "items": { "$elemMatch": { "type": "bpmn:StartEvent" } } }
```
