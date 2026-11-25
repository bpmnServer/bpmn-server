[bpmn-server](../readme.md) / IWho

# Interface: IWho

Someone the reverse of a policy asks about (whoMay).

## Table of contents

### Properties

- [kind](IWho.md#kind)
- [label](IWho.md#label)
- [user](IWho.md#user)
- [because](IWho.md#because)

## Properties

### kind

• **kind**: ``"administrators"`` \| ``"person"`` \| ``"role"`` \| ``"anyone"``

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:60](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L60)

___

### label

• **label**: `string`

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:61](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L61)

___

### user

• `Optional` **user**: [`ISecurityUser`](ISecurityUser.md)

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:62](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L62)

___

### because

• `Optional` **because**: `string`

why they are asked about: how the case names them

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:64](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L64)
