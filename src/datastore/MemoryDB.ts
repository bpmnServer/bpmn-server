import { MongoLikeQuery } from "./MongoLikeQuery";

const fs = require('fs');
const Path = require('path')

class MemoryDB  {
    db: Map<string,any>;

	constructor() {
        this.db=new Map<string,any>();
	}


    getFile(id) {

        let contents=this.db.get(id);
		try {
			return contents;
		}
		catch(exc) {
			return {};
		}
    
    }
	async find(query) {
		
		let files=await this.getList();
		let instances=[];
		(await files).forEach(id=>{
			let data = this.getFile(id);
			instances.push(data);
		});
		let res=MongoLikeQuery.filterObjects(instances,query);
		return res;
	}
    async saveFile(id, data,owner=null) {
        this.db.set(id,data);
    
    }
    
    
    async deleteFile(id): Promise<void> {

        this.db.delete(id);
    
    }
    
    

    async getList(): Promise<string[]> {

        return Array.from(this.db.keys());
    
    
    }
    
    
}
export { MemoryDB };