import { Node } from './Elements';
import { Item } from '../engine/Item';
/** Behaviour
 *      ioSpecification
 *      timer
 *      message
 *      signal
 *
 *   each behaviour is a class
 *      it scans def and insert itself to perform actions as required
 *
 */
interface IBehaviour {
    start(item: Item): any;
    run(item: Item): any;
    end(item: Item): any;
    resume(item: Item): any;
    getNodeAttributes(attributes: any[]): any;
    getItemAttributes(item: Item, attributes: any[]): any;
}
declare const Behaviour_names: {
    TimerEventDefinition: string;
    LoopCharacteristics: string;
    IOSpecification: string;
    TerminateEventDefinition: string;
    CamundaFormData: string;
};
declare class Behaviour implements IBehaviour {
    node: Node;
    definition: any;
    constructor(node: Node, definition: any);
    static behaviours: {
        name: string;
        funct: (node: any, def: any) => IOBehaviour;
    }[];
    static scan(node: Node): void;
    init(): void;
    start(item: Item): void;
    run(item: Item): void;
    end(item: Item): void;
    resume(item: Item): void;
    getNodeAttributes(attributes: any[]): void;
    getItemAttributes(item: Item, attributes: any[]): void;
}
declare class IOBehaviour extends Behaviour {
    start(item: Item): void;
    end(item: Item): void;
}
declare class LoopBehaviour extends Behaviour {
    init(): void;
    get collection(): any;
    isSequential(): any;
}
export { IBehaviour, Behaviour, Behaviour_names, LoopBehaviour };
