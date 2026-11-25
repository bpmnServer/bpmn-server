[bpmn-server](../readme.md) / ISecurityUser

# Interface: ISecurityUser

Who asks: a user name and groups; administrators and the system are not asked (`unrestricted`).

## Table of contents

### Properties

- [userName](ISecurityUser.md#username)
- [userGroups](ISecurityUser.md#usergroups)
- [unrestricted](ISecurityUser.md#unrestricted)

## Properties

### userName

• **userName**: `string`

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:32](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L32)

___

### userGroups

• **userGroups**: `string`[]

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:33](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L33)

___

### unrestricted

• `Optional` **unrestricted**: `boolean`

an administrator, the system, or security rules turned off (ENFORCE_SECURITY=false)

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:35](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L35)
