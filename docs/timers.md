# Timers

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
## Implementations

### Intermediate Events

Are implemented as a normal event, will start the timer at start of the node and once the timer is completed the node will end.

Repeating timers, will create a new Item everytime

### Start Event

Start Event Timers will start a new execution, therefore, they are scheduled by a cron job managed by bpmn-server.

