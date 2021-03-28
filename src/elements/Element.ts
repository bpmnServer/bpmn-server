
import { Execution } from '../engine/Execution';
import { Token } from '../engine/Token';
import { IBehaviour, Behaviour} from './behaviours/.';
import { NODE_ACTION, FLOW_ACTION, EXECUTION_EVENT, TOKEN_STATUS, ITEM_STATUS } from '../../';

import { Item } from '../engine/Item';
import { Node } from '.';
import { IElement } from '../interfaces/elements';


class Element implements IElement {
    id;
    type;
    subType;
    name;
    behaviours = new Map();
    isFlow=false;
/* is called after the execution is restarted */

    continue(item: Item) { }
    describe():string[][] { return [];}
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