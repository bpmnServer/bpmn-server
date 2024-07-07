import { MongoLikeQuery } from "./MongoLikeQuery";

const fs = require('fs');
const Path = require('path')

class JSONDB  {
    path:any;
	ext:any;

	constructor(path,ext) {
		this.path=path;
		this.ext=ext;
	}


    private getPath(id) {
            return this.path+'/'+id+'.'+this.ext;
    }
    getFile(id) {

        let file = fs.readFileSync(this.getPath(id),
            { encoding: 'utf8', flag: 'r' });
		try {
			return JSON.parse(file);
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
    async saveFile(name, data,owner=null) {
        let fullpath = this.getPath(name);
        await fs.writeFileSync(fullpath, JSON.stringify(data), function (err) {
            if (err) {
				console.log('write error',err);
				throw err;
			}
        });
    
    }
    
    
    async deleteFile(id): Promise<void> {
    
        await fs.unlink(this.getPath(id) ,  function (err) {
            if (err) console.log('ERROR: ' + err);
        });
    }
    
    

    async getList(): Promise<string[]> {

        let files = [];
    
        await fs.readdirSync(this.path).forEach(file => {
            if (Path.extname(file) == '.'+this.ext) {
                let name = Path.basename(file);
                name = name.substring(0, name.length - 3);;
                files.push(name);
            }
        });
    
        return files;
    }
    
    
}
export { JSONDB };