/**
 * 
 * 
 input Query:

 ```json
 {		"items.status":"wait",
		"name": "Buy Used Car with Lanes",
		"$or":[
			{"items.candidateGroups":"Owner"},
			{"items.candidateUsers":"User1"}
			]
}
```
	/*

MongoQuery:

 ```json
{	"name":"Buy Used Car with Lanes",
	"$or":[
			{"items":{"$elemMatch":{"candidateGroups":"Owner"}}},
			{"items":{"$elemMatch":{"candidateUsers":"User1"}}}
		],
	"items":{"$elemMatch":{"status":"wait"}
}
```

	And filter items by performing the Query on each Instance Item 

 * 
 * Supported Operators:
 * - $or
 * - $lte
 * - $lt
 * - $gte
 * - $gt
 * - $eq
 *	Missing the following:
 * - $ne
 * - $regex
 * - $in
 * - $and
 *
 *	https://www.mongodb.com/docs/manual/reference/operator/query/
 *	
 * */
class QueryTranslator {

	childName;
	constructor(childName) {
		this.childName = childName;
    }
	translateCriteria(query) {

		let match = {};
		let hasMatch = false;
		let newQuery = {};
		Object.keys(query).forEach(key => {
			let val = query[key];
			if (key=='$or')
			{
				let predicates=[];
				let res;
				val.forEach(predicate => {
					res = this.translateCriteria(predicate);
					predicates.push(res);
				});
				newQuery['$or']= predicates;
			}
			else if (key.startsWith(this.childName+'.')) {
				key = key.replace(this.childName + '.', '');
				match[key] = val;
				hasMatch = true;
			}
			else
				newQuery[key] = val;
		});

		if (hasMatch) {
			newQuery[this.childName] = { $elemMatch: match };
		}
		return newQuery;
	}

	private filterOr(item, condition) {
		let pass = false;
		for (let c = 0; c < condition.length; c++) {
			pass = this.filterItem(item, condition[c]);
			if (pass == true)	// or
				break;
		}
		return pass;
    }
	public filterItem(item,query)
	{
//		console.log('--filterItem--', item.seq, JSON.stringify(query),this.childName);
		let pass = true;
		const keys=Object.keys(query);
		for (let k=0; k< Object.keys(query).length;k++)  {
			const key=keys[k];
			let condition = query[key];
			if (key==this.childName)
				pass= this.evaluateCondition(item, condition['$elemMatch']);
			else if (key=='$or')
				pass = this.filterOr(item, condition);

//			console.log('key:', key, 'pass', pass);
			if (!pass)
				break;
		}
		return pass;

	}

	private evaluateCondition(i,condition) {
		let pass = true;
//		console.log('	evaluateCondition',i.seq, condition);
		const keys = Object.keys(condition);
		for (let k = 0; k < keys.length; k++) {
			const key = keys[k];
			let cond = condition[key];
			pass= this.evaluateValue(i,key,cond);
			if (pass===false)
				break;
		}
		return pass;
    }
	
	private evaluateValue(i,key,cond) {
		let pass = true;
			let val = i;
			if (key.includes('.')) {
				let ks = key.split('.');
				ks.forEach(k => {
					val = val[k];
				});
				if (val !== cond)
					pass = false;
			}
			else if (Array.isArray(i[key])) {
				if (Array.isArray(cond))
					pass = i[key].some(r => cond.includes(r))
				else if (!i[key].includes(cond))
					pass = false;
			}
			else if (typeof cond === 'object' &&
				!Array.isArray(cond) &&
				cond !== null) {
				pass = this.parseComplexCondition(cond, i[key]);
			}
			else if (cond === null && i[key] == null)
				pass = true;
			else if (i[key] !== cond)
				pass = false;

//			console.log('		cond:', cond, key, i[key], pass);

			if (pass == false)
				return false;
		return pass;
    }

	private parseComplexCondition(condition,val) 
	{
		let ret=false;
		Object.keys(condition).forEach(cond=>{
			let term=condition[cond];
			switch(cond) {
				case '$gte':
					ret=(val>term)||(val===term);
					break;
				case '$gt':
					ret=(val>term);
					break;
				case '$eq':
					ret=(val===term);
					break;
				case '$lte':
					ret=(val<term)||(val===term);
					break;
				case '$lt':
					ret=(val<term);
					break;
				case '$exists':
					 
					if ((!val) && term == false)
						ret=true;
					if ((val) && term == true)
						ret=true;
					else 
						ret=false;
					
					break;
				default:
					ret=false;
					break;
				}
			if (ret==false)
				return false;
		});
		return ret;
	}


}

export { QueryTranslator };