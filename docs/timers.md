# Timers

All Timers are persisted, therefore, if the Node.js session is restared timers will pickup where they left     
## Timer Types

### DateTime (not supported)
```javascript
  <timerEventDefinition>
        <timeDate>2011-03-11T12:13:14Z</timeDate>
    </timerEventDefinition>
```
### Duration

Example (interval lasting 10 days):

```javascript
    <timerEventDefinition>
        <timeDuration>P10D</timeDuration>
    </timerEventDefinition>
```

### Time Cycle

Example (3 repeating intervals, each lasting 10 hours):

```javascript
    <timerEventDefinition>
        <timeCycle>R3/PT10H</timeCycle>
    </timerEventDefinition>
```

Time Cycle accepts both ISO 8601 format and Cron format

Example for cron format:

```javascript
    <timerEventDefinition>
        <bpmn:timeCycle xsi:type="bpmn:tFormalExpression">5 * * * *</bpmn:timeCycle>
    </timerEventDefinition>
```



## Event Types

| Event Type | TimeDate  |  Duration  | TimeCycle  | TimeCycle Repeat |
| -------------|-----------|  -------------|-----------|-------- |
| Start          | NA       | NA             | Yes        |Default |
|Intermediate    | NA      |Yes            |Yes        |NA |
|Boundary Event   |NA         |Yes            |Yes        |Yes |


- Start Event support 'Time Cycle' only since duration and timeDate make no sense.
 
- Intermediate Events are implemented as a normal event, will start the timer at start of the node and once the timer is completed the node will end.

- Start Event Timers will start a new execution, therefore, they are scheduled by a cron job managed by bpmn-server.



## Implementation:
   
### On Server start:

1. All start event are re-evaluated and reschedules
2. other events that are in wait state are re-evaluated and reschedules



       