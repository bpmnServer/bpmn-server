<h1>Introduction to BPMN Processes</h1>

<p><strong>Process</strong> defines the sequence and rules of flow objects:</p>
<p><strong>Events</strong>:  something that happens during the process</p>
<p><strong>Activities</strong>: work Performed in the process</p>
<p><strong>Gateways</strong>:  decision points to split or merge the flow</p>
<p><strong>Flow</strong>:  navigation tools between Nodes (Events, Activities and Gateways).</p>
![](Got-Mail2.png)

<p>Here is the sequence of execution</p>

|#| Method      | Image | Description                          |
|-| ----------- | ------|------------------------------------ |
|1|<p >start Event</p>|![](BPMN_start_event-47x47-1.png) |This is the starting point of the Process|
|2|Get Mail Message|![](BPMN_task_activity-100x75.png)|Why: the sequence flow goes from Start Event to here</p><p>It is a user task, so a user need to complete this task|
|3|Gateway|![](BPMN_exclusive_gateway-59x59.png)|Why: the sequence flow again brings us to this point</p><p>This is a decision (XOR) gateway, it will invoke either branch but never both, based on the logic determined earlier:</p><p>If the email is <strong>Junk</strong> it will go to <strong>Bin Message</strong></p><p>If the email is <strong>Not Junk</strong> it will go to <strong>Read Message </strong>|
|4|Bin Message|![](BPMN_task_activity-100x75.png)|A User Task|
|5|Read Message|![](BPMN_task_activity-100x75.png)|Another Task|
|6|Gateway|![](BPMN_exclusive_gateway-59x59.png)|This Gateway will wait for either Task to complete before proceeding|
|7|End Event|![](BPMN_end_event-50x51.png)|This will End the Process|


<h4>Supported BPMN Objects</h4>

| Type/ Notation | Description                          |
|----------------|--------------------------------------|
|Start Event|Start point for the process. Every Process must have at least one Start Event.|
|Intermediate Event|In the middle of the process|
|End Event|At end of Process|
|Normal Event</p><p>![](BPMN_start_event-47x47.png) |
|Timer Event</p>![](BPMN_timer-47x47.png) |The Event goes in a wait state till the timer (delay or schedule) condition is met, then the Event is executed and continues the flow.|
|Catch Message Event</p><p>![](message.png) |The Event goes in a wait state till the exepcted Message is received then the Event is executed and continues the flow.|
|Throw Message Event</p><p >![](event-throw-message.png)||
|Catch Signal Event</p><p>![](BPMN_signal-47x47-1.png) |The Event goes in a wait state till the exepcted Signal is received then the Event is executed and continues the flow.|
|Throw  Signal Event</p>![](event-throw-signal.png)||
|User Task<p>![](BPMN-User-Task.png) |A User Task is a typical “workflow” Task where a human performer performs the Task with the assistance of a software application and is scheduled through a task list manager of some sort. Typically it produces a form to capture user input.|
|Script Task</p>![](BPMN-ScriptTask.png)||
|Service Task<p>![](BPMN-Service-Task.png)||
|Receive Task<p>![](BPMN-Receive-Task.png)|A Receive Task is a simple Task that is designed to wait for a Message</a> to arrive from an external Participant (relative to the Process). Once the Message has been received, the Task is completed.|
|Send Task<p>![](BPMN-SendTask.png)|A Send Task is a simple Task that is designed to send a Message</a> to an external Participant (relative to the Process). Once the Message has been sent, the Task is completed.|


|           | Inbound (Converging)| Outbound (Diverging) |                      
|-----------|---------------------|----------------------|
|Parallel Gateway(AND) <p>![](BPMN_parallel_gateway-59x59.png) |It waits for <strong>all active </strong>incoming branches to complete.|<strong>all</strong> outgoing branches are activated simultaneously.|
|Exclusive Gateway (XOR)<p>![](BPMN_exclusive_gateway-59x59.png)|it waits for <strong>one</strong> incoming branch to complete|<strong>Only one</strong> of the outgoing branches based on conditions.|
| Inclusive Gatewy (OR)<p> ![](BPMN_inclusive_gateway-59x59.png) |It waits for <strong>all active</strong> incoming branches to complete.|<strong> One or more</strong> branches are activated based on branching conditions.|
| Event-Based Gateway<p> ![](BPMN_event_based_gateway-59x59.png)  ![](Event-based-gateway-with-events.png)| Waits for the any event to take place before proceeding, then cancels other events.|

