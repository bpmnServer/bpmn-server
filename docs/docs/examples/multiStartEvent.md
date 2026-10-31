
# Multiple Start Event


![Image description](invoice-start.png)


When a definition/process has multiple start node, you need to specify the start node when starting the process:

From the Web UI:

![Image description](invoice-start-prompt.png)

From API:
```ts
    
    response = await api.engine.start('invoice', 
        { reminderCounter: 0, caseId: caseId}, user, {startNodeId:'StartEvent_AP'});
```
