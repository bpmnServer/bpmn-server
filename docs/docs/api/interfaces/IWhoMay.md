[bpmn-server](../readme.md) / IWhoMay

# Interface: IWhoMay

What one of them may do with a case, and with each of its waiting user tasks.

## Table of contents

### Properties

- [who](IWhoMay.md#who)
- [access](IWhoMay.md#access)
- [tasks](IWhoMay.md#tasks)

## Properties

### who

• **who**: [`IWho`](IWho.md)

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:69](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L69)

___

### access

• **access**: [`IAccess`](IAccess.md)

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:70](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L70)

___

### tasks

• **tasks**: \{ `seq`: `number` ; `elementId`: `string` ; `name?`: `string` ; `offered`: `boolean` ; `claim`: `boolean` ; `complete`: `boolean` ; `assign`: `boolean` ; `rules`: [`IPolicyRule`](IPolicyRule.md)[]  }[]

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:71](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L71)
