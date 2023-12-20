
	Execution						Execution
_______________________             ____________
Item 1   2        3					  3		4
S	E S		E S       W				C   E S    E
_____ _______ _________				_____ ______
    V       V         V					V      V

log	
					Instance
__________________________________________________________________


1.	Server 
	created once and has the life of the entire Node process

2.	Execution 
is created for every API call has the life of the call
has an instance of logger

3.	Save is performed at end of every node execution (end or wait)

4.	Execution locks the instance, only one execution at a time for a given instance to avoid conflict


call sequence

Execution:
------------
1 engine.start()

		const execution = new Execution(this.server,name, source);
	
		const newDataStore =new DataStore(this.server);
		this.server.dataStore = newDataStore;

		newDataStore.monitorExecution(execution);
		this.cache.add(execution);

		execution.worker = execution.execute(startNodeId, data, options);

2 execution.execute
```ts
  public async execute(startNodeId = null, inputData = {}, options = {}) {

        await this.definition.load();

        this.process = startNode.process;

        let token = await Token.startNewToken(TOKEN_TYPE.Primary,this, startNode, null, null, null, null,null,true);

        const proc = startNode.process;
 
		await proc.start(this, token);
        await token.execute(null);

        await Promise.all(this.promises);
```
3. process
```ts   
/**
     * Notify process that it started
     * */
    async start(execution: Execution,parentToken) {
        this.subProcessEvents = [];
        const events = [];
        this.eventSubProcesses.forEach(p => {
            p.getStartNodes().forEach(st => {
                events.push(st);
            });
        });
        let i;
        for (i = 0; i < events.length; i++) {
            const st = events[i];
            execution.log('..starting event start subporcess ' + st.id)
            const newToken = await Token.startNewToken(TOKEN_TYPE.EventSubProcess,execution, st, null, parentToken, null, null);
            this.subProcessEvents.push(newToken.currentItem);
        }
    }
```
4. Token.execute
```ts
		new item
		ret=node.execute(item)
		if (ret)
			wait:
			terminate:
			error:
			cancel:
		goNext();
```
5.  Node.execute

```ts

        this.enter(item);   // no choice
        let ret =await this.start(item);


        if (ret == NODE_ACTION.error || ret == NODE_ACTION.abort)
            return ret;
        else if (ret ==NODE_ACTION.wait) {
            await this.doEvent(item, EXECUTION_EVENT.node_wait, ITEM_STATUS.wait);
            return ret;
        }
 
 
        ret = await this.run(item);
        switch (ret) {
            case NODE_ACTION.error:
                return ret;
                break;
            case NODE_ACTION.abort:
                return ret;
                break;
        }
 
        return await this.continue(item);

    }
    /*
     *  called by execute or by token.invoke to continue work already started
     */
    async continue(item: Item) {

        await this.end(item);
        return;
    }
    async end(item: Item) {

        await  this.cancelBoundaryEvents(item);

        let i;
        for (i = 0; i < this.outbounds.length; i++) {
            let flow = this.outbounds[i];
                if (flow.type == BPMN_TYPE.MessageFlow) {
                    let flowItem = new Item(flow, item.token);
                    await flow.execute(flowItem);
                }
        }

        if (item.status == ITEM_STATUS.end)
            return;
        item.endedAt = new Date().toISOString();;
        this.behaviours.forEach(async function (b) { await b.end(item); });
        await this.doEvent(item, EXECUTION_EVENT.node_end, ITEM_STATUS.end);
        this.behaviours.forEach(async function (b) { await b.exit(item); });

    }
 
```

terminate:
---------
is called by 
    Terminate End Event
    Error Event
    Cancel Event (for Transaction)

Steps:
1.  Scope is current process or sub-process and all it's children processes
2.  Establish event handlers (for Error/Cancel)
3.  wait for all running tokens to complete
4.  terminate/cancel/void all nodes in wait except handlers
5.  invoke handlers

