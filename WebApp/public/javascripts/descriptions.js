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
	Task: {
		name: "task",
		desc: "Work that needs to be perfomed in a Process.",
		start: KW_autoStart,
		completion: KW_scriptComplete,
		designOptions: ["Define Action", KW_acl],
	},

	// ----------------------	userTask   ---------------------- 

	UserTask: {
		name: "userTask",
		desc: "Work that needs to be perfomed in a Process.",
		start: KW_autoStart,
		completion: KW_manualComplete,
		designOptions: ["Define Action", KW_acl],
	},

	// ----------------------	serviceTask   ---------------------- 
	ServiceTask:
	{
		name: "serviceTask",
		desc: "Work that needs to be perfomed in a Process.",
		start: KW_autoStart,
		completion: KW_scriptComplete,
		designOptions: ["Define Action", KW_acl],
	},

	// ----------------------	receiveTask   ---------------------- 
	ReceiveTask:
	{
		name: "receiveTask",
		desc: "Work that needs to be perfomed in a Process.",
		start: KW_autoStart,
		completion: KW_messageReceived,
		designOptions: ["Define Action", KW_acl],
	},

	// ----------------------	sendTask   ---------------------- 
	SendTask:
	{
		name: "sendTask",
		desc: "Work that needs to be perfomed in a Process.",
		start: KW_autoStart,
		completion: KW_scriptComplete,
		designOptions: ["Define Action", KW_acl],
	},
	// ----------------------	scriptTask   ---------------------- 
	ScriptTask:
	{
		name: "scriptTask",
		desc: "Work that needs to be perfomed in a Process.",
		start: KW_autoStart,
		completion: KW_scriptComplete,
		designOptions: ["Define Action", KW_acl],
	},

	// ----------------------	manualTask   ---------------------- 
	ManualTask:
	{
		name: "manualTask",
		desc: "Work that needs to be perfomed in a Process.",
		start: KW_autoStart,
		completion: KW_manualComplete,
		designOptions: ["Define Action", KW_acl],
	},

	// ----------------------	startEvent   ---------------------- 
	StartEvent:
	{
		name: "startEvent",
		desc: "Start Event is the where the Process can start. <br />",
		start: KW_manualStart,
		completion: KW_autoComplete,
		designOptions: [KW_logic, KW_acl],
		modelOptions: [KW_timer, KW_message, KW_signal],
	},

	// ----------------------	endEvent   ---------------------- 
	EndEvent:
	{
		name: "endEvent",
		desc: "End Event is the where the Process Ends.",
		start: KW_autoStart,
		completion: KW_autoComplete,
		designOptions: [KW_logic],
		modelOptions: ["Terminate Event:		 Will terminate all running activities"]
	},
	IntermediateCatchEvent:
	// ----------------------	intermediateCatchEvent   ---------------------- 
	{
		name: "intermediateCatchEvent",
		desc: "End Event is the where the Process Ends.",
		start: KW_autoStart,
		completion: KW_autoComplete,
		designOptions: [],
		modelOptions: ["Terminate Event:		 Will terminate all running activities"]
	},

	// ----------------------	intermediateThrowEvent   ---------------------- 
	IntermediateThrowEvent:
	{
		name: "intermediateThrowEvent",



		desc: "End Event is the where the Process Ends.",
		start: KW_autoStart,
		completion: KW_autoComplete,
		designOptions: [],
		modelOptions: ["Terminate Event:		 Will terminate all running activities"],

	},

	// ----------------------	messageEvent   ---------------------- 
	MessageEvent:
	{
		name: "messageEvent",
		desc: "End Event is the where the Process Ends.",
		start: KW_autoStart,
		completion: KW_autoComplete,
		designOptions: []
	},

	// ----------------------	exclusiveGateway   ---------------------- 
	ExclusiveGateway:
	{
		name: "exclusiveGateway",

		desc: "Controls the flow of the process.",
		start: KW_autoStart,
		completion: KW_autoComplete +
			"Only one outgoing flow will be executed based on the conditions" +
			"< p /> If none of the conditions are met the default flow will be executed.",
		designOptions: [],
		modelOptions: [],

	},

	// ----------------------	inclusiveGateway   ---------------------- 
	InclusiveGateway:
	{
		name: "inclusiveGateway",
		desc: "Controls the flow of the process.",
		start: KW_autoStart,
		completion: KW_autoComplete,
		designOptions: [],

	},

	// ----------------------	parallelGateway   ---------------------- 
	ParallelGateway:
	{
		name: "parallelGateway",
		desc: "Controls the flow of the process",
		start: KW_converge + ' ' + KW_waitIncomingFlows,
		completion: KW_autoComplete,
		designOptions: [],


	},

	// ----------------------   eventBasedGateway   ---------------------- 
	EventBasedGateway:
	{
		name: "eventBasedGateway",

		desc: "Controls the flow of the process.",
		start: KW_autoStart,
		completion: KW_autoComplete,
		designOptions: [],


	},

	// ----------------------   complexGateway   ---------------------- 
	ComplexGateway:
	{
		name: "complexGateway",
		desc: "Controls the flow of the process",
		start: KW_autoStart,
		completion: KW_autoComplete,
		designOptions: [],
	},

	// ----------------------	messageFlow   ---------------------- 
	MessageFlow:
	{
		name: "messageFlow",

		desc: "Carries a Message between two nodes",
		start: KW_autoStart,
		completion: KW_autoComplete,
		designOptions: [],
		modelOptions: []

	},


	// ----------------------	sequenceFlow   ---------------------- 
	SequenceFlow:
	{
		name: "sequenceFlow",
		desc: "Defines (the sequence) of flow between activites",
		start: "Only if the specified condition is met.",
		completion: KW_autoComplete,
		designOptions: [KW_condition, "Defines Case Status"],
		modelOptions: [],

	}
};
