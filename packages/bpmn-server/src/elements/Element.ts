
import { Execution } from '../engine/Execution.js';
import { Token } from '../engine/Token.js';
import { type IBehaviour, Behaviour } from './behaviours/Behaviour.js';
import { NODE_ACTION, FLOW_ACTION, EXECUTION_EVENT, TOKEN_STATUS, ITEM_STATUS } from '../interfaces/Enums.js';

import { Item } from '../engine/Item.js';
import { Node } from './Node.js';
import { IElement } from '../interfaces/elements.js';


class Element implements IElement {
    id;
    type;
    subType;
    name;
    behaviours = new Map();
    isFlow=false;
    lane;
    continue(item: Item) { }
    describe(): string[][] {
        return [];
    }
    restored(item: Item) {
        this.behaviours.forEach(behav => { behav.restored(item) });
    }
    resume(item: Item) {
        this.behaviours.forEach(behav => { behav.resume(item) });
    }
    /**
     * respond by providing behaviour attributes beyond item and node information
     *  ex: timer due , input/outupt , fields 
     * */
    hasBehaviour(name): boolean {

        return this.behaviours.has(name);
    }
    getBehaviour(name) {
        return this.behaviours.get(name);
    }
    addBehaviour(nane,behavriour) {
        this.behaviours.set(nane,behavriour);
    }

}

export { Element}