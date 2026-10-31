import BpmnServerPropertiesProvider from './BpmnServerPropertiesProvider.js';
import ScriptContext from './code/ScriptContext.js';

export default {
    __init__: ['bpmnServerPropertiesProvider', 'scriptContext'],
    bpmnServerPropertiesProvider: ['type', BpmnServerPropertiesProvider],
    scriptContext: ['type', ScriptContext]
};
