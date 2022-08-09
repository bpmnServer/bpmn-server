[bpmn-server](../README.md) › [Listener](listener.md)

# Class: Listener

## Hierarchy

* EventEmitter

  ↳ **Listener**

## Index

### Properties

* [defaultMaxListeners](listener.md#static-defaultmaxlisteners)

### Methods

* [addListener](listener.md#addlistener)
* [delegateEvent](listener.md#delegateevent)
* [doEvent](listener.md#doevent)
* [emit](listener.md#emit)
* [eventNames](listener.md#eventnames)
* [getMaxListeners](listener.md#getmaxlisteners)
* [listenerCount](listener.md#listenercount)
* [listeners](listener.md#listeners)
* [on](listener.md#on)
* [once](listener.md#once)
* [prependListener](listener.md#prependlistener)
* [prependOnceListener](listener.md#prependoncelistener)
* [removeAllListeners](listener.md#removealllisteners)
* [removeListener](listener.md#removelistener)
* [setMaxListeners](listener.md#setmaxlisteners)
* [listenerCount](listener.md#static-listenercount)

## Properties

### `Static` defaultMaxListeners

▪ **defaultMaxListeners**: *number*

*Inherited from [Listener](listener.md).[defaultMaxListeners](listener.md#static-defaultmaxlisteners)*

Defined in node_modules/@types/node/base.d.ts:895

## Methods

###  addListener

▸ **addListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Listener](listener.md).[addListener](listener.md#addlistener)*

*Overrides void*

Defined in node_modules/@types/node/base.d.ts:897

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  delegateEvent

▸ **delegateEvent**(`event`: any, `execution`: [IExecution](../interfaces/iexecution.md)): *Promise‹void›*

Defined in bpmnServer/src/server/Listener.ts:12

**Parameters:**

Name | Type |
------ | ------ |
`event` | any |
`execution` | [IExecution](../interfaces/iexecution.md) |

**Returns:** *Promise‹void›*

___

###  doEvent

▸ **doEvent**(`event`: any, `execution`: any, `item`: any): *Promise‹void›*

Defined in bpmnServer/src/server/Listener.ts:6

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`event` | any | - |
`execution` | any | - |
`item` | any | null |

**Returns:** *Promise‹void›*

___

###  emit

▸ **emit**(`event`: string | symbol, ...`args`: any[]): *boolean*

*Inherited from [Listener](listener.md).[emit](listener.md#emit)*

*Overrides void*

Defined in node_modules/@types/node/base.d.ts:907

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |
`...args` | any[] |

**Returns:** *boolean*

___

###  eventNames

▸ **eventNames**(): *Array‹string | symbol›*

*Inherited from [Listener](listener.md).[eventNames](listener.md#eventnames)*

*Overrides void*

Defined in node_modules/@types/node/base.d.ts:908

**Returns:** *Array‹string | symbol›*

___

###  getMaxListeners

▸ **getMaxListeners**(): *number*

*Inherited from [Listener](listener.md).[getMaxListeners](listener.md#getmaxlisteners)*

*Overrides void*

Defined in node_modules/@types/node/base.d.ts:905

**Returns:** *number*

___

###  listenerCount

▸ **listenerCount**(`type`: string | symbol): *number*

*Inherited from [Listener](listener.md).[listenerCount](listener.md#static-listenercount)*

*Overrides void*

Defined in node_modules/@types/node/base.d.ts:909

**Parameters:**

Name | Type |
------ | ------ |
`type` | string &#124; symbol |

**Returns:** *number*

___

###  listeners

▸ **listeners**(`event`: string | symbol): *Function[]*

*Inherited from [Listener](listener.md).[listeners](listener.md#listeners)*

*Overrides void*

Defined in node_modules/@types/node/base.d.ts:906

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |

**Returns:** *Function[]*

___

###  on

▸ **on**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Listener](listener.md).[on](listener.md#on)*

*Overrides void*

Defined in node_modules/@types/node/base.d.ts:898

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  once

▸ **once**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Listener](listener.md).[once](listener.md#once)*

*Overrides void*

Defined in node_modules/@types/node/base.d.ts:899

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  prependListener

▸ **prependListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Listener](listener.md).[prependListener](listener.md#prependlistener)*

*Overrides void*

Defined in node_modules/@types/node/base.d.ts:900

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  prependOnceListener

▸ **prependOnceListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Listener](listener.md).[prependOnceListener](listener.md#prependoncelistener)*

*Overrides void*

Defined in node_modules/@types/node/base.d.ts:901

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  removeAllListeners

▸ **removeAllListeners**(`event?`: string | symbol): *this*

*Inherited from [Listener](listener.md).[removeAllListeners](listener.md#removealllisteners)*

*Overrides void*

Defined in node_modules/@types/node/base.d.ts:903

**Parameters:**

Name | Type |
------ | ------ |
`event?` | string &#124; symbol |

**Returns:** *this*

___

###  removeListener

▸ **removeListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [Listener](listener.md).[removeListener](listener.md#removelistener)*

*Overrides void*

Defined in node_modules/@types/node/base.d.ts:902

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  setMaxListeners

▸ **setMaxListeners**(`n`: number): *this*

*Inherited from [Listener](listener.md).[setMaxListeners](listener.md#setmaxlisteners)*

*Overrides void*

Defined in node_modules/@types/node/base.d.ts:904

**Parameters:**

Name | Type |
------ | ------ |
`n` | number |

**Returns:** *this*

___

### `Static` listenerCount

▸ **listenerCount**(`emitter`: EventEmitter, `event`: string | symbol): *number*

*Inherited from [Listener](listener.md).[listenerCount](listener.md#static-listenercount)*

Defined in node_modules/@types/node/base.d.ts:894

**Parameters:**

Name | Type |
------ | ------ |
`emitter` | EventEmitter |
`event` | string &#124; symbol |

**Returns:** *number*
