import express from 'express';

import FS from 'node:fs';

import { BPMNServer, dateDiff, Behaviour_names   } from '../index.js';
import { BPMNAPI , SecureUser , SystemUser} from '../index.js';
import { Common } from './common.js';


export class ViewHelper {

    static dateDisplay(date) {
        if (date)
            return (date).toISOString().split('T')[0];
        else
            return '';

    }
    static dateInput(dateString) {
        if (dateString === '' || dateString=='Invalid Date')
            return null;
        else
            return new Date(dateString);
    }
    static formatData(data) {
        let vars = [];
        Object.keys(data).forEach(function (key) {
            let value = data[key];
            if (Array.isArray(value))
                value = JSON.stringify(value);
            if (typeof value === 'object' && value !== null)
                value = JSON.stringify(value);

            vars.push({ key, value });
        });
        return vars;

    }

    static async getNodeInfo(bpmnServer,processName, elementId) {

        let definition = await bpmnServer.definitions.load(processName);
        let node = definition.getNodeById(elementId);
        let extName = Behaviour_names.CamundaFormData;
        let ext;
        if (node)
            ext = node.getBehaviour(extName);
        let fields;
        if (ext)
            fields = ext.fields;
        return { node, fields };
    }

    static parseField(field, value, data) {
        if (field) {
            if (value.substring(0, 1) == '[') {
                value = value.substring(1);
                value = value.substring(0, value.length - 1);
                let array = value.split(',');
                value = array;
            }
            data[field] = value;
        }
    }
    static calculateDecorations(items,tokens) {
        let decors = [];
        let seq = 1;
        items.forEach(item => {
            let color = 'red';
            if (item.status == 'end') {
                if (item.endedAt == null && item.type != 'bpmn:SequenceFlow')
                    color = 'gray';
                else
                    color = 'black';
            }
            let decor = {type:'seq', id: item.elementId, color, seq };

            decors.push(decor);
            let tokenDecor=item.tokenId;
            let token=tokens[item.tokenId];
            if (token.parentTokenId)
                tokenDecor+=':'+token.parentTokenId;
            decors.push({type:'token', id: item.elementId, color:'blue',token: '('+tokenDecor+')' });
            seq++;
        });
        return decors;
    }
    static async getProcs(bpmnAPI,process=null) {
		let list=[];
		let query={};
		if (process)
			query={"name":process};
	
		let procs=await bpmnAPI.model.get(query,SystemUser);
	
			procs.forEach(r => { 
				let docs;
				let evnts=[];
				r.processes.forEach(p=>{ 
					if (p.documentation)
						docs+=p.documentation});
				r.events.forEach(e=>{
					evnts.push({name: e.name, documentation: e.documentation});
	
				});
	
				 list.push({ name: r.name, documentation: docs , events:evnts}); 
			}); 
		return list;
	}
	static getProcsDocs(procs) {
		let procsDocs={};
		procs.forEach(proc=>{
				let doc='';
				console.log('proc:',proc);
				if (proc.processes) {
					proc.processes.forEach(p=>{
						if (p.documentation)
							doc+=p.documentation;
					});
		
				}
				proc.events.forEach(e=>{
					if (e.documentation)
						doc+='Event:'+e.id+':'+e.documentation;
				});
				procsDocs[proc.name]=doc;
		});
		return procsDocs;
	}

}
//export default router;
