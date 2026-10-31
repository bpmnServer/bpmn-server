# Features by Examples

## Business Rule Task

BPMN-Server supports Business Rules implemented through DMN-Engine
Business Rules can be defined as a Decision Table as in this example:

![Vacation Decision Table](examples/VacationDecisionTable.PNG)

Decision Table is called through 
```ts
    <bpmn2:businessRuleTask id="Task_1lcamp6" name="Vacation"  camunda:decisionRef="Vacation">
```
This will load the file 'Vacation.json' form the Processes folder as defined in configuration.js


