import { copyFileSync } from 'fs';
import { BPMNClient } from './';

test();
async function test() {
        const dotenv = require('dotenv');
        dotenv.config();
        console.log('env:',process.env.HOST, process.env.PORT, process.env.API_KEY);

        const server1 = new BPMNClient(process.env.HOST, process.env.PORT, process.env.API_KEY);

		const res=await server1.datastore.find(
			{
			filter: { "items.type":"bpmn:UserTask"},
		 	sort: {'items.startedAt':1}, 
		 	//limit:20, // limit
		 	projection:{ id:1,"_id":1, name:1, startedAt:1,status:1, 
				"items.name":1, "items.startedAt":1,"items.type":1, "items.status":1},
			getTotalCount:true
});
		console.log(res.data.length,res.nextCursor,res.totalCount);

}
