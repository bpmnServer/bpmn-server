import { Node } from "..";
import { Item } from "../../engine/Item";
import { IItem } from "../../..";
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
    node: Node;
    definition: any;
    start(item: IItem): any;
    run(item: IItem): any;
    end(item: IItem): any;
    restored(item: IItem): any;
    resume(item: IItem): any;
    getNodeAttributes(attributes: any[]): any;
    getItemAttributes(item: IItem, attributes: any[]): any;
    describe(): string[];
    init(): any;
}
declare class Behaviour implements IBehaviour {
    node: Node;
    definition: any;
    constructor(node: Node, definition: any);
    restored(item: any): void;
    describe(): any[];
    init(): void;
    start(item: Item): void;
    run(item: Item): void;
    end(item: Item): void;
    resume(item: Item): void;
    getNodeAttributes(attributes: any[]): void;
    getItemAttributes(item: Item, attributes: any[]): void;
}
export { IBehaviour, Behaviour };
