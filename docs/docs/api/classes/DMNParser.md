[bpmn-server](../readme.md) / DMNParser

# Class: DMNParser

## Table of contents

### Constructors

- [constructor](DMNParser.md#constructor)

### Properties

- [cache](DMNParser.md#cache)

### Methods

- [loadFile](DMNParser.md#loadfile)
- [parse](DMNParser.md#parse)
- [decision](DMNParser.md#decision)
- [check](DMNParser.md#check)

## Constructors

### constructor

• **new DMNParser**(): [`DMNParser`](DMNParser.md)

#### Returns

[`DMNParser`](DMNParser.md)

## Properties

### cache

▪ `Static` `Private` **cache**: `Map`\<`string`, \{ `mtimeMs`: `number` ; `definitions`: [`DMNDefinitions`](../readme.md#dmndefinitions)  }\>

#### Defined in

[packages/bpmn-server/src/dmn/DMNParser.ts:48](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/dmn/DMNParser.ts#L48)

## Methods

### loadFile

▸ **loadFile**(`filePath`): `Promise`\<[`DMNDefinitions`](../readme.md#dmndefinitions)\>

Parse a DMN file; a parsed file is kept until it changes.

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |

#### Returns

`Promise`\<[`DMNDefinitions`](../readme.md#dmndefinitions)\>

#### Defined in

[packages/bpmn-server/src/dmn/DMNParser.ts:51](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/dmn/DMNParser.ts#L51)

___

### parse

▸ **parse**(`xml`): `Promise`\<[`DMNDefinitions`](../readme.md#dmndefinitions)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `xml` | `string` |

#### Returns

`Promise`\<[`DMNDefinitions`](../readme.md#dmndefinitions)\>

#### Defined in

[packages/bpmn-server/src/dmn/DMNParser.ts:67](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/dmn/DMNParser.ts#L67)

___

### decision

▸ **decision**(`node`): [`Decision`](../readme.md#decision)

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `any` |

#### Returns

[`Decision`](../readme.md#decision)

#### Defined in

[packages/bpmn-server/src/dmn/DMNParser.ts:79](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/dmn/DMNParser.ts#L79)

___

### check

▸ **check**(`definitions`): [`DMNIssue`](../readme.md#dmnissue)[]

What is wrong with a file's decisions: hit policies, rule sizes and FEEL that does not parse.

#### Parameters

| Name | Type |
| :------ | :------ |
| `definitions` | [`DMNDefinitions`](../readme.md#dmndefinitions) |

#### Returns

[`DMNIssue`](../readme.md#dmnissue)[]

#### Defined in

[packages/bpmn-server/src/dmn/DMNParser.ts:125](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/dmn/DMNParser.ts#L125)
