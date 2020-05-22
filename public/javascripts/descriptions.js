/* to describe the model */


	const  KW_manualStart = "Manually Start";
	const  KW_converge = "If Converging:";
	const  KW_diverge = "If Diverging:";
	const  KW_waitIncomingFlows = "Waits for all incoming flows to complete";
	const  KW_autoStart = "When any incoming flow arrives";
	const  KW_manualComplete = "When an authorized user designates the task to be complete.";
	const  KW_autoComplete = "Completes as soon as it arrives";
	const  KW_scriptComplete = "Completes when the action completes";
	const  KW_messageReceived = "Completes when message is received";
	const  KW_logic = "Custom Logic can be added";
	const  KW_condition = "Logical Condition";
	const  KW_acl = "User Access is controlled";
	const  KW_timer = "Timer to delay completion to specific time or duration";
	const  KW_message = "Message to delay completion until a specific message arrives";
	const  KW_signal = "Signal to delay completion until a specifi signal arrives";

const bpmn_descriptions = {
		// ----------------------	task   ---------------------- 
		name = {
			name: "task" ,
			desc: "Work that needs to be perfomed in a Process.",
			start:		KW_autoStart;
			completion: KW_scriptComplete;
			designOptions: ["Define Action", KW_acl],
			modelOptions: ["More to come..."],

		} ,

		// ----------------------	userTask   ---------------------- 

		 userTask = {
			name: "userTask",
			desc: "Work that needs to be perfomed in a Process.",
			start: KW_autoStart;
			completion: KW_manualComplete;
			designOptions: ["Define Action", KW_acl],
			modelOptions: ["More to come..."],

		},

		// ----------------------	serviceTask   ---------------------- 
		serviceTask=
		{
			name: "serviceTask",
			desc: "Work that needs to be perfomed in a Process.",
			start: KW_autoStart;
			completion: KW_scriptComplete;
			designOptions: ["Define Action", KW_acl],
			modelOptions: ["More to come..."],

		},

		// ----------------------	receiveTask   ---------------------- 
	receiveTask=
		{
			name: "receiveTask",
			desc: "Work that needs to be perfomed in a Process.",
			start: KW_autoStart;
			completion: KW_messageReceived;
			designOptions: ["Define Action", KW_acl],
			modelOptions: ["More to come..."],

		},

		// ----------------------	sendTask   ---------------------- 
	sendTask=
		{
			name: "sendTask",
			desc: "Work that needs to be perfomed in a Process.",
			start: KW_autoStart;
			completion: KW_scriptComplete;
			designOptions: ["Define Action", KW_acl],
			modelOptions: ["More to come..."],
		},

		// ----------------------	scriptTask   ---------------------- 
	scriptTask=
		{
			name: "scriptTask",
			desc: "Work that needs to be perfomed in a Process.",
			start: KW_autoStart;
			completion: KW_scriptComplete;
			designOptions: ["Define Action", KW_acl],
			modelOptions: ["More to come..."],
		},

		// ----------------------	manualTask   ---------------------- 
	manualTask=
		{
			name: "manualTask",
			desc: "Work that needs to be perfomed in a Process.",
			start: KW_autoStart;
			completion: KW_manualComplete;
			designOptions: ["Define Action", KW_acl],
			modelOptions: ["More to come..."],
		},

		// ----------------------	startEvent   ---------------------- 
	startEvent=
		{
			name: "startEvent",
			desc: "Start Event is the where the Process can start. <br />"
				. "{
                         var nodes = JsonNodes('items.[node.type==''startEvent'']'],
	if (nodes.length > 1]return 'this process has ' + nodes.length + Start Events';}",
	start: KW_manualStart;
	completion: KW_autoComplete;
	designOptions: [KW_logic, KW_acl],
		modelOptions: [KW_timer, KW_message, KW_signal],
		},

// ----------------------	endEvent   ---------------------- 
	endEvent=
{
	name: "endEvent",
	desc: "End Event is the where the Process Ends.",
			start: KW_autoStart;
	completion: KW_autoComplete;
	designOptions: [KW_logic],
		modelOptions: ["Terminate Event:		 Will terminate all running activities"],
		},

// ----------------------	intermediateCatchEvent   ---------------------- 

{
	name: "intermediateCatchEvent",



		desc: "End Event is the where the Process Ends.",
			start: KW_autoStart;
	completion: KW_autoComplete;
	designOptions: [],
		modelOptions: ["Terminate Event:		 Will terminate all running activities"],
		
		},

// ----------------------	intermediateThrowEvent   ---------------------- 

{
	name: "intermediateThrowEvent",



		desc: "End Event is the where the Process Ends.",
			start: KW_autoStart;
	completion: KW_autoComplete;
	designOptions: [],
		modelOptions: ["Terminate Event:		 Will terminate all running activities"],
		
		},

// ----------------------	messageEvent   ---------------------- 

{
	name: "messageEvent",



		desc: "End Event is the where the Process Ends.",
			start: KW_autoStart;
	completion: KW_autoComplete;
	designOptions: [],
		modelOptions: ["More to come..."],
		
		
		},

// ----------------------	exclusiveGateway   ---------------------- 

{
	name: "exclusiveGateway",



		desc: "Controls the flow of the process.",
			start: KW_autoStart;
	completion: KW_autoComplete. 
		 "Only one outgoing flow will be executed based on the conditions.
		< p /> If none of the conditions are met the default flow will be executed.",
	designOptions: [],
		modelOptions: [],
		
		},

// ----------------------	inclusiveGateway   ---------------------- 

{
	name: "inclusiveGateway",



		desc: "Controls the flow of the process.",
			start: KW_autoStart;
	completion: KW_autoComplete;
	designOptions: [],
		modelOptions: ["More to come..."],
		
		},

// ----------------------	parallelGateway   ---------------------- 

{
	name: "parallelGateway",



		desc: "Controls the flow of the process",
			start: KW_converge.' '.KW_waitIncomingFlows;
	completion: KW_autoComplete;
	designOptions: [],
		modelOptions: ["More to come..."],
		
		},

// ----------------------   eventBasedGateway   ---------------------- 

{
	name: "eventBasedGateway",



		desc: "Controls the flow of the process.",
			start: KW_autoStart;
	completion: KW_autoComplete;
	designOptions: [],
		modelOptions: ["More to come..."],
		
		},

// ----------------------   complexGateway   ---------------------- 

{
	name: "complexGateway",



		desc: "Controls the flow of the process",
			start: KW_autoStart;
	completion: KW_autoComplete;
	designOptions: [],
		modelOptions: ["More to come..."],
		
		},

// ----------------------	messageFlow   ---------------------- 

{
	name: "messageFlow",



		desc: "Carries a Message between two nodes",
			start: KW_autoStart;
	completion: KW_autoComplete;
	designOptions: [],
		modelOptions: []
		
		}.


// ----------------------	sequenceFlow   ---------------------- 

	{
	name: "sequenceFlow",



		desc: "Defines (the sequence) of flow between activites",
			start: "Only if the specified condition is met.",
				completion: KW_autoComplete;
	designOptions: [KW_condition, "Defines Case Status"],
		modelOptions: [],
                
		}
		];

