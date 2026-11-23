[bpmn-server](../readme.md) / IModelSecurity

# Interface: IModelSecurity

What a model says for security: its process's policy, its tasks', the fields its forms enter, its actors (owf:actor).

## Table of contents

### Properties

- [policy](IModelSecurity.md#policy)
- [taskPolicies](IModelSecurity.md#taskpolicies)
- [formFields](IModelSecurity.md#formfields)
- [taskFields](IModelSecurity.md#taskfields)
- [actors](IModelSecurity.md#actors)

## Properties

### policy

• `Optional` **policy**: `string`

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:75](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L75)

___

### taskPolicies

• **taskPolicies**: `Map`\<`string`, `string`\>

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:75](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L75)

___

### formFields

• **formFields**: `Set`\<`string`\>

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:75](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L75)

___

### taskFields

• **taskFields**: `Map`\<`string`, `Set`\<`string`\>\>

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:75](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L75)

___

### actors

• **actors**: `Map`\<`string`, `string`\>

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:75](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L75)
