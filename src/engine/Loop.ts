import { Token, TOKEN_TYPE } from './Token';
import { Node, LoopBehaviour, Behaviour_names, BPMN_TYPE } from '../elements/';

import { Execution } from './Execution';
import { ScriptHandler } from '.';
import { ITEM_STATUS } from '../interfaces';

class Loop {
    id;
    node;
    ownerToken;
    definition: LoopBehaviour;
    sequence;
    dataPath;
    _items: any[];
    completed;  // used to count # completed for parallel loops
    isSequential() { return (this.definition.isSequential()); }
    isStandard() { return (this.definition.isStandard()); }

    constructor(node: Node, token: Token, dataObject?: any) {

        this.node = node;
        this.ownerToken = token;

        this.id = token.execution.getNewId('loop');
        if (dataObject) {
            this.id = dataObject.id;
            this._items = dataObject.items;
            this.completed = dataObject.completed;
            this.sequence = dataObject.sequence;
            this.definition = node.loopDefinition;
            this.endFlag = dataObject.endFlag;
        }
        else {
            this.definition = node.loopDefinition;
            this.completed = 0;
            this.sequence = 0;
            if (token.dataPath!=='')
                this.dataPath = token.dataPath + '.' + this.node.id;
            else
                this.dataPath = this.node.id;

        }
    }
    save() {
        return {
            id: this.id, nodeId: this.node.id, ownerTokenId: this.ownerToken.id, dataPath: this.dataPath,
            items: this._items, endFlag: this.endFlag,
            completed: this.completed, sequence: this.sequence
        };
    }
    // for Manual Loops:
    endFlag=false;
    end() {
        this.endFlag=true;
    }
    static load(execution, dataObject): Loop {

        let node = execution.getNodeById(dataObject.nodeId);
        let ownerToken = execution.getToken(dataObject.ownerTokenId);
        let loop = new Loop(node, ownerToken, dataObject);
        loop.dataPath = dataObject.dataPath;
        loop.sequence = dataObject.sequence;
        loop._items=dataObject.items;
        return loop;

    }
    getKeyName() {
        return 'loopKey';
    }
    async getItems() {
        if (this._items==null) {
            this._items=await this.ownerToken.execution.scriptHandler.evaluateExpression(this.ownerToken,this.definition.collection);
            if (Number.isInteger(this._items))
            {
                this._items=[...Array(this._items).keys()];
            }
        }
 
        return this._items;
    }
    async isDone(): Promise<boolean> {
        let items=await this.getItems();
        return (this.sequence > items.length - 1)
    }
    async getNext() {
        let items=await this.getItems();
        if (items.length>this.sequence)
            return items[this.sequence++];
        else
            return null;
    }
    static async checkStart(token) {
        // loop
        const loopDefinition = token.currentNode.loopDefinition;
        if (loopDefinition) {

            if (token.loop && token.loop.node.id == token.currentNode.id) // already assigned a loop
            {
                return true; // go ahead and execute
            }

            /**
             * an item is already created belonging to current token,
             *  this item will not be used in the loop
             */            
            // token.currentItem.status=ITEM_STATUS.end;
            let loop = new Loop(token.currentNode, token);


            if (loopDefinition.isSequential()) {
                // are we starting a new loop or continueing in an exiting one?
    
                let seq = await loop.getNext();
                let data = {};

                let newToken = await Token.startNewToken(TOKEN_TYPE.Instance,token.execution, token.currentNode, 
                        loop.dataPath+'.'+seq, token, token.currentItem, loop, data,false,seq);

                return false; // launching new token; stop this one

            }
            else if (loopDefinition.isStandard()) {
                token.log("standard loop");
                // are we starting a new loop or continueing in an exiting one?
                try {

                    let seq = loop.sequence++;//await loop.getNext();
                    let data = {};
 
                    let newToken = await Token.startNewToken(TOKEN_TYPE.Instance, token.execution, token.currentNode, 
                            loop.dataPath + '.' + seq, token, token.currentItem, loop, data,false,seq);
                }
                catch (exc) {
                    console.log(exc);
                }


                return false; // launching new token; stop this one

            }
            else { // parallel 
                // launch as many tokens as needed
                let seq;
                let items=await loop.getItems();

                if (items) {
                    let tokens=[];
                    for (seq = 0; seq < items.length; seq++) {
                        let entry = items[seq];
                        let data = {};
                        let newToken = await Token.startNewToken(TOKEN_TYPE.Instance, token.execution, token.currentNode,
                             loop.dataPath+'.'+entry , token, token.currentItem, loop, data,true,entry);
                        tokens.push(newToken);

                        token.log('created token '+newToken.id+' for ' + entry);

                    }
                    for(let i=0;i<tokens.length;i++)
                    {
                        await tokens[i].execute();
                    }

                }
                else {
                    token.error("loop has no items");
                }

                token.log('..loop: fired all tokens' + seq);
                return false; // launching new tokens; stop this one

            }
        }
        else
            return true; // continue with the normal logic 
    }
    static async cancel(fromItem) {
        // cancel all items of the loop

        let currentLoop=fromItem.token.loop.id;
        let promises=[]
        let loopFirstToken=null;
        let tokens=[];
        fromItem.token.execution.tokens.forEach(t=>{
            if (t.loop && t.loop.id == currentLoop && t.id !==fromItem.token.id)
                {
                    if (loopFirstToken==null)
                        loopFirstToken=t;
                    tokens.push(t);
                }
        });
        for(let i=0 ; i < tokens.length;i++) {
            await tokens[i].terminate();
        }        // also cancel the original item 
        await loopFirstToken.parentToken.currentNode.end(loopFirstToken.parentToken.currentItem);

        await Promise.all(promises);
    }
    static async checkNext(token: Token) {

        if (token.loop && token.currentNode.id==token.loop.node.id) {
            if (token.loop.isSequential()) {
                if (await token.loop.isDone()) {

                    // need to converge here ;
                    await token.end();
                    //token.parentToken.currentItem.status=ITEM_STATUS.end;
                    await token.parentToken.currentNode.end(token.parentToken.currentItem);
                    await token.parentToken.goNext();
                    return false;
                }
                else {
                    
                    await token.end();
                    let seq = await token.loop.getNext();
                    let data = {};
  
                    //token=token.parentToken;
                    let newToken = await Token.startNewToken(TOKEN_TYPE.Instance, token.execution, token.currentNode, 
                            token.loop.dataPath + '.' + seq, token.parentToken, token.parentToken.currentItem, token.loop, data,false,seq);
//                let newToken = await Token.startNewToken(TOKEN_TYPE.Instance,token.execution, token.currentNode, token.loop.dataPath, token, token.currentItem, token.loop, data);

                    return false;
                }
            }
            else if (token.loop.isStandard())
            {
                if (token.loop.endFlag==true)
                {
                    await token.end();
                    //token.parentToken.currentItem.status=ITEM_STATUS.end;
                    await token.parentToken.currentNode.end(token.parentToken.currentItem);
                    await token.parentToken.goNext();
                }
                else 
                {
                    let seq = token.loop.sequence++;//await loop.getNext();
                    let data = {};
 
                    let newToken = await Token.startNewToken(TOKEN_TYPE.Instance, token.execution, token.currentNode, 
                            token.loop.dataPath + '.' + seq, token, token.currentItem, token.loop, data,false,seq);

                }

                return false; // no further action

            }
            else { // parallel 
                await token.end();
                token.loop.completed++;
                let items = await token.loop.getItems();
                if (token.loop.completed == items.length) {
                    // need to converge here ;
                        if (token.parentToken.currentItem)
                            await token.parentToken.currentNode.end(token.parentToken.currentItem);
                        await token.parentToken.goNext();
                    return false;
                    if (token.currentNode.type==BPMN_TYPE.SubProcess) {
                        const children = token.childrenTokens;
                        for (let i = 0; i < children.length; i++) {
                            const child = children[i];
                            if (child.type == TOKEN_TYPE.SubProcess) {
                                child.signal({});
                            }
                        }
                    }/*
                    let parent=token.parentToken;
                    if(parent.currentItem)
                        await parent.goNext();
                    else
                        await parent.parentToken.goNext(); */
                    return false;
                }
                return false; // no further action

            }
        }
        return true; // continue with the normal logic 

    }

}
export {Loop}