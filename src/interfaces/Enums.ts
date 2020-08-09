enum NODE_SUBTYPE {
    timer = 'timer',
    message = 'message',
    signal = 'signal',
    error = 'error',
    escalation = 'escalation'
}
/*
 * ALL events 
 */
enum EXECUTION_EVENT {
    node_enter = 'enter', node_start = 'start', node_wait = 'wait', node_end = 'end', node_terminated = 'terminated',
    transform_input = 'transformInput', transform_output ='transformOutput',
    flow_take = 'take', flow_discard = 'discard',
    execution_execute = 'execution.execute',   execution_executed = 'execution.executed',
    execution_invoke = 'execution.invoke',     execution_invoked = 'execution.invoked',
    execution_restored = 'execution.restored', execution_resumed = 'execution_resumed',
    execution_wait = 'execution.wait',
    execution_end = 'execution.end', execution_terminated = 'executeion.terminate' ,
    token_start = 'token.start', token_wait = 'token.wait', token_end = 'token.end', token_terminated = 'token.terminated' 
}
/*
 *  possible actions by node
 */
//   must be same as above
enum NODE_ACTION { continue = 'continue', end = 'end', stop = 'stop', error = 'error', abort = 'abort', wait = 'wait' }

enum ITEM_STATUS {  enter = 'enter', start = 'start', wait = 'wait', end = 'end', terminated = 'terminated' , discard= 'discard'}

//type ITEMSTATUS = 'enter' | 'start' | 'wait' | 'end' | 'terminated' | 'discard';

enum EXECUTION_STATUS { running='running',wait='wait', end = 'end' , terminated ='terminated' }

enum TOKEN_STATUS { running = 'running', wait = 'wait', end = 'end', terminated = 'terminated' }
/*
 * possible actions by flow
 */
//   must be same as above

enum FLOW_ACTION { take = 'take', discard = 'discard' }


export {
    EXECUTION_EVENT, NODE_ACTION, FLOW_ACTION,
    ITEM_STATUS, TOKEN_STATUS, EXECUTION_STATUS , NODE_SUBTYPE
}