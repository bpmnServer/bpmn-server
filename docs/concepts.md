Features
=========


<!-- toc -->
- [BPMN 2](#bpmn-2)
- [Executable Workflow](#executable-workflow)
- [Instance Persistence](#instance-persistence)
- [Accessible to your App](#accessible-to-your-App)
- [Logging and debugging](#logging-and-debugging)
- [Web User Interface](#user-interface)
- [Built for Integration](#built-for-integration)

<!-- tocstop -->

Workflow is a state machine. You can imagine it as a flow chart running inside in your application, and when it reach a decision point, you can invoke a method to provide an answer that chooses the right path of execution from there. 

So workflow is a graph of control flow, and activities are its nodes. They can be as simple like an if..then..else branch, or as complex like getting data from a database and do something complicated depending on the results.

A workflow is an application running inside in your application, have its state and variables, and correlated across Node.js cluster and process instances. So if your Node.js application consists of many instances inside a cluster and many clusters across a server farm, a workflow instance will work like a single instance application within those. A workflow application could outlive Node.js applications, they have out-of-the-box persistence support to make them ideal platform to do long running business processes, durable services or scheduled backgound tasks.

#Built-in Modeling

# General Concepts

The Workflow is modelled in [BPMN 2]() and is represented in one or more [Defintion]()s is actual source of the BPMN model is also called a Process.

[Instance]() represent the an occurance of the workflow, therefore, evey time a Process starts a new instnace is created.

The Workflow is executed using BPMN-Engine package

# Your App components

[configuration.js]() to hold all environment configuration

[defnitions.js]() either holds Workflow Defintions or points to it

[CustomEngine.ts]() this is where you place your custom code to be implemented inside the workflow

# BPMN Server components

[BPMNServer Class]() is the entry point or API 

[WFInstance Class]() represent the Worflow instance either currently running or completed saved for reporting purposes

[Execution Class]() is the worker class processing the workflow through BPMN-Engine.

[DataStore Class]() responsible for data storage and retrieval of Instances and related data

[CacheManager Class]() 

# Executable Workflow


https://github.com/paed01/bpmn-engine

# Instance Persistence 

# Accessible to your App

# Logging and debugging

# User Interface

# Built for Integration

	Server Cached Engines
		Stop
		Start
	WorkFlow Presistence	-	done
	Stop and Resume			-	done
	User Tasks				-	done
	message					-	done
	timers					-	done
	timer start event
	Customization			done
	Notification
		

