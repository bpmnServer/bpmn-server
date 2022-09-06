import { Node } from './Node';
import { BPMN_TYPE } from '../interfaces/Enums';
declare class NodeLoader {
    static loadNode(el: any, process: any): Node;
}
export { NodeLoader, BPMN_TYPE };
