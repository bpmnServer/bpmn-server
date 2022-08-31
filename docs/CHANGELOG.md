# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

<!---
your comment goes here
and here
## [Unreleased]
### Added

### Changed
-->
## Release 1.3.2    - 2022-30-08

Fixed import process error due to old version of connect-busboy


## Release 1.3.1    - 2022-30-08

Fixed compile error with updated tsc


## Release 1.3.0    - 2022-21-08

This is a major release, requires an upgrade and changes to existing code base.

### Support bpmnjs properties-panel

Provides a UI to edit bpmn definition, therefore, no longer a need to edit the bpmn file

In order to provide this, changes to bpmn specification to be more compliant as follows:

#### Event Script definition

- the only events are: start,end 
- old format:

```xml

    <bpmn:startEvent id="StartEvent_1ohx91b">
      <bpmn:extensionElements>
        <camunda:script event="start"><![CDATA[
        console.log("This is the start event");
          this.applyInput({records:[1,2,3]});
          console.log(this.data);
          console.log("This is the start event");]]></camunda:script>
      </bpmn:extensionElements>
      <bpmn:outgoing>Flow_18xinq3</bpmn:outgoing>
    </bpmn:startEvent>
    
```
- New format:
```xml
      <bpmn2:extensionElements>
        <camunda:executionListener event="start">
          <camunda:script scriptFormat="JavaScript">
			script1
		  </camunda:script>
        </camunda:executionListener>
        <camunda:executionListener event="end">
          <camunda:script scriptFormat="JavaScript">
			script2
			</camunda:script>
        </camunda:executionListener>
      </bpmn2:extensionElements>
```


#### Input/Output Definition

Handling Input and Output has changed please [this for details](data.md#Input-Output_Data)

#### Conditional Flow
- Old Format:
```xml
    <bpmn:conditionExpression xsi:type="bpmn:tExpression">
		<![CDATA[(this.needsCleaning=="Yes")]]>
	</bpmn:conditionExpression>
```
- New Format:
```xml 
    <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression" language="JavaScript">
		(item.data.needsCleaning=="Yes")
	</bpmn:conditionExpression>
```


## Release 1.2.5    - 2022-16-08
Added API
    engine/status


## Release 1.2.4    - 2022-08-08
### Added:

- Access Control Rules 
- Client API can specify the userId 
- Improved documentation


## Release 1.2.0    - 2022-08-08

Added WebAPI calls
Added Remote access through bpmn-client package
improved documentation

## Release 1.1.4    - 2020-07-21

### Added
- docs\examples.md add lot more examples
- engine.start(...,options)
- AppDelegate now has serviceProvider class as a separate object
- 

### Changed
- signature to service calls
  - old format: service(item);
  - new format: return=service(input,executionContext);

### Removed
-   server.cron.checktimers();