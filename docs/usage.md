
# Folder Structure



# Data Structure

# Data Query

filter:
{ "items.type" : "bpmn:StartEvent"  , name: "Buy Used Car"} 

projection:

{ "items": { $elemMatch: { type: 'bpmn:StartEvent' } } }