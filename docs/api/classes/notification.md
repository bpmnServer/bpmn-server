[bpmn-server](../README.md) › [Notification](notification.md)

# Class: Notification

## Hierarchy

* **Notification**

## Index

### Properties

* [cancelDate](notification.md#canceldate)
* [cancelEvent](notification.md#cancelevent)
* [dateCreated](notification.md#datecreated)
* [delay](notification.md#delay)
* [event](notification.md#event)
* [eventDate](notification.md#eventdate)
* [id](notification.md#id)
* [issueDate](notification.md#issuedate)
* [repeat](notification.md#repeat)
* [ruleId](notification.md#ruleid)
* [status](notification.md#status)
* [template](notification.md#template)
* [text](notification.md#text)
* [userGroup](notification.md#usergroup)
* [userId](notification.md#userid)
* [userName](notification.md#username)

### Methods

* [describe](notification.md#describe)
* [execute](notification.md#execute)

## Properties

###  cancelDate

• **cancelDate**: *any*

Defined in bpmnServer/src/acl/Repository.ts:164

___

###  cancelEvent

• **cancelEvent**: *any*

Defined in bpmnServer/src/acl/Repository.ts:163

___

###  dateCreated

• **dateCreated**: *any*

Defined in bpmnServer/src/acl/Repository.ts:165

___

###  delay

• **delay**: *any*

Defined in bpmnServer/src/acl/Repository.ts:157

___

###  event

• **event**: *any*

Defined in bpmnServer/src/acl/Repository.ts:154

___

###  eventDate

• **eventDate**: *any*

Defined in bpmnServer/src/acl/Repository.ts:155

___

###  id

• **id**: *any* = uuidv4()

Defined in bpmnServer/src/acl/Repository.ts:149

___

###  issueDate

• **issueDate**: *any*

Defined in bpmnServer/src/acl/Repository.ts:161

___

###  repeat

• **repeat**: *any*

Defined in bpmnServer/src/acl/Repository.ts:162

___

###  ruleId

• **ruleId**: *any*

Defined in bpmnServer/src/acl/Repository.ts:150

___

###  status

• **status**: *any*

Defined in bpmnServer/src/acl/Repository.ts:158

___

###  template

• **template**: *any*

Defined in bpmnServer/src/acl/Repository.ts:156

___

###  text

• **text**: *any*

Defined in bpmnServer/src/acl/Repository.ts:166

___

###  userGroup

• **userGroup**: *any*

Defined in bpmnServer/src/acl/Repository.ts:153

___

###  userId

• **userId**: *any*

Defined in bpmnServer/src/acl/Repository.ts:151

___

###  userName

• **userName**: *any*

Defined in bpmnServer/src/acl/Repository.ts:152

## Methods

###  describe

▸ **describe**(): *string*

Defined in bpmnServer/src/acl/Repository.ts:200

**Returns:** *string*

___

###  execute

▸ **execute**(`context`: [IExecution](../interfaces/iexecution.md)): *Promise‹void›*

Defined in bpmnServer/src/acl/Repository.ts:175

will issue the notification through email
if delayed, will wait for the cron job to execute it

Step 1:  build the template

Step 2:  Issue the email;

**Parameters:**

Name | Type |
------ | ------ |
`context` | [IExecution](../interfaces/iexecution.md) |

**Returns:** *Promise‹void›*
