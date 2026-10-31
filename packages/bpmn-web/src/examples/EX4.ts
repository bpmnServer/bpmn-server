import {} from './';
interface IQuery {
    [key: string]: any;
}

interface IProjection {
    [key: string]: 0 | 1 | IProjection;
}

interface IDocument {
    [key: string]: any;
}

class MongoQuery {
    private data: IDocument[];

    constructor(data: IDocument[]) {
        this.data = data;
    }

    find(query: IQuery, projection: IProjection): IDocument[] {
        const filteredData = this.filter(query);
        return this.project(filteredData, projection);
    }

    private filter(query: IQuery): IDocument[] {
        return this.data.filter(obj => this.matchQuery(obj, query));
    }

    private project(filteredData: IDocument[], projection: IProjection): IDocument[] {
        return filteredData.map(obj => this.projectObject(obj, projection));
    }
    private matchQuery(obj: IDocument, query: IQuery): boolean {
        for (const key in query) {
            if (query.hasOwnProperty(key)) {
                const keys = key.split('.');
                let objValue = obj;
                for (const k of keys) {
                    objValue = objValue[k];
                    if (objValue === undefined) {
                        return false;
                    }
                }
    
                const queryValue = query[key];
    
                if (Array.isArray(objValue) && queryValue.hasOwnProperty('$elemMatch')) {
                    const elemMatchQuery = queryValue['$elemMatch'];
                    if (!objValue.some((item: IDocument) => this.matchQuery(item, elemMatchQuery))) {
                        return false;
                    }
                }
                else if (typeof queryValue === 'object' && !Array.isArray(queryValue)) {
                if (!objValue || typeof objValue !== 'object') {
                        return false;
                    }
                    if (!this.matchQuery(objValue, queryValue)) {
                        return false;
                    }
                   
                } else if (typeof queryValue === 'object') {
                    if (!objValue || !Array.isArray(objValue)) {
                        return false;
                    }
                    if (!objValue.some((item: IDocument) => this.matchQuery(item, queryValue))) {
                        return false;
                    }
                } else {
                    if (objValue !== queryValue) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    
    private matchQuery2(obj: IDocument, query: IQuery): boolean {
        for (const key in query) {
            if (query.hasOwnProperty(key)) {
                const keys = key.split('.');
                let objValue = obj;
                for (const k of keys) {
                    objValue = objValue[k];
                    if (objValue === undefined) {
                        return false;
                    }
                }

                const queryValue = query[key];

                if (typeof queryValue === 'object' && !Array.isArray(queryValue)) {
                    if (!objValue || typeof objValue !== 'object') {
                        return false;
                    }
                    if (!this.matchQuery(objValue, queryValue)) {
                        return false;
                    }
                } else if (typeof queryValue === 'object') {
                    if (!objValue || !Array.isArray(objValue)) {
                        return false;
                    }
                    if (!objValue.some((item: IDocument) => this.matchQuery(item, queryValue))) {
                        return false;
                    }
                } else {
                    if (objValue !== queryValue) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    private projectObject(obj: IDocument, projection: IProjection): IDocument {
        const projectedObj: IDocument = {};
        for (const key in projection) {
            if (projection.hasOwnProperty(key)) {
                const subProjection = projection[key];
                if (subProjection === 1 && obj.hasOwnProperty(key)) {
                    projectedObj[key] = obj[key];
                } else if (typeof subProjection === 'object') {
                    if (typeof obj[key] === 'object') {
                        projectedObj[key] = this.projectObject(obj[key], subProjection);
                    }
                }
            }
        }
        return projectedObj;
    }
}

//////
// Example data
const data: IDocument[] = [
    { 
        name: 'John', 
        age: 30, 
        address: { 
            city: 'New York', 
            country: 'USA',
            coordinates: { 
                latitude: 40.7128, 
                longitude: -74.0060 
            } 
        },
        hobbies: [
            { name: 'Reading', type: 'Indoor' },
            { name: 'Hiking', type: 'Outdoor' },
            { name: 'Gaming', type: 'Indoor' }
        ]
    },
    { 
        name: 'Alice', 
        age: 25, 
        address: { 
            city: 'London', 
            country: 'UK',
            coordinates: { 
                latitude: 51.5074, 
                longitude: -0.1278 
            } 
        },
        hobbies: [
            { name: 'Traveling', type: 'Outdoor' },
            { name: 'Cooking', type: 'Indoor' },
            { name: 'Photography', type: 'Outdoor' }
        ]
    },
    { 
        name: 'Bob', 
        age: 35, 
        address: { 
            city: 'Paris', 
            country: 'France',
            coordinates: { 
                latitude: 48.8566, 
                longitude: 2.3522 
            } 
        },
        hobbies: [
            { name: 'Painting', type: 'Indoor' },
            { name: 'Running', type: 'Outdoor' },
            { name: 'Dancing', type: 'Indoor' }
        ]
    },
];

// Create a MongoQuery instance
const mongoQuery = new MongoQuery(data);

// Test query and projection
const query: IQuery = { hobbies: { $elemMatch: { type: 'Outdoor' } } };
const projection: IProjection = { name: 1, hobbies: { name: 1 } };

// Perform find operation
const result = mongoQuery.find(query, projection);

console.log(result);
