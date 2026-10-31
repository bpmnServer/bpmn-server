# Development Environemnt

To Create a new Development Enviroment:

1. Create a dev folder
2. git clone the repos under the folder
-    bpmn-server
-    bpmn-web
-    bpmn-client
-    docs

3.  change dependecy of bpmn-web to the folder ../bpmn-server, by:
```
    npm i ../bpmn-server

```

4. to Publish changes:
    use git push as usual for all repo
    for bpmn-server:
        npm publish
    for docs
        mkdocs gh-deploy


New Status:
----------

Action: start/invoke etc.
Internal Action:
    -   execute a node completed from wait
    -   gotoNext Node
    -   goto wait state
    -   end parent node (like as subprocess)
    -   cancel /terminate node (like boundary)

New Debugger
------------
server.engine.debug(queryForItem,scriptToRun)