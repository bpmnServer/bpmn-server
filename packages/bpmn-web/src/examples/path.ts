

import { configuration, Token  } from './';
import { BPMNServer, Logger } from './';

const logger = new Logger({ toConsole: true });

//test();
list('afa7a7ec-2385-4fff-9c47-a8e056b0ff11');

async function list(id) {
    const server = new BPMNServer(configuration, logger);

 
    let list = await server.dataStore.findInstances({id},"full");//{name:'Error events'},"full");
    let inst=list[0];
    let items=inst.items.filter(i=>{return (i.type=='bpmn:UserTask')})
        .sort((a,b)=>{return a.itemKey>b.itemKey});
    items.forEach(item=>{
        let status;
        if (item.endedAt==null && item.status=='end')
            status='Cancelled';
        else
            status=item.status;
        console.log(`${item.seq} - ${item.itemKey} - ${status} - ${item.candidateGroups}`);
    });

}
async function test() {

    const server = new BPMNServer(configuration, logger);



    // we execute a process by name; in this case 'Buy Used Car'

    let list = await server.dataStore.findInstances({id:"d68ab96f-4e07-4401-9c46-d5b92eec5997"},"full");//{name:'Error events'},"full");
    let inst=list[0];

    buildPath(inst);
    //console.log(inst);

    inst.tokens.forEach(token => {
        let parent=token.parentToken?token.parentToken.id:'';
        let path='';
        token.path.forEach(p=>{
            path+='>'+p.seq+'-'+p.elementId;
        });

        let origItem=getItem(inst,token.originItem);
        let origin=origItem!==null?origItem.elementId:'';
        


        console.log(`  token: <${ token.id }  -<${ parent}  path: <${ path} -  origin ${origin}`);
    });

    inst.items.forEach(item => {
        console.log(`  item <${ item.seq } > -<${ item.elementId } > tid: <${ item.tokenId } > `);
    });

}
function getItem(inst,id) {
    for(let i=0;i<inst.items.length;i++){
        if (inst.items[i].id===id)
            return inst.items[i];
    }
    return null;

}
function buildPath(inst) {
    inst.tokens.forEach(t=>{t.path=[];});

    inst.items.forEach(i => {
        const token:Token = getToken(inst,i.tokenId);
        token.path.push(i);
        }); 
}
function getToken(inst,tid):Token {
    return inst.tokens[tid];
}
