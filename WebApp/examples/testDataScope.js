class ScopeData {
    constructor(inputData, parent = null, name = null , isArray=null) {

        this._name = name;

        if (parent) {
            this._parent = parent;

            if (isArray === true) { // an array
                this._data = [];
                parent[name] = this._data;
                this._isArray = true;
            }
            else if (parent._isArray) {
                this._data = {};
                let arr = parent._parent[parent._name];
                this._seq = arr.length;
                arr.push(this._data);
            }
            else {
                this._data = {};
                parent._data[name] = this._data;
            }
        }
        else {
            this._data = this;
        }
        this.applyInput(inputData);

    }
    applyInput(inputData) {
        Object.keys(inputData).forEach(key => {
            this._data[key] = inputData[key];
        });

    }
    getPath() {
        let path = [];
            path.unshift(this._name);
        let node = this._parent;
        while (node) {
            let name;
            if (node._name) name = node._name;
            if (node._seq)
                name = '[' + node._seq + ']';
            if (name)
                path.unshift(name);
            node=node._parent;
        }
        return path.join('.').replace('.[','[');
    }
}

let root = new ScopeData({ caseId: 1001 });
console.log(root);
let child1 = new ScopeData({ taskId: 201 }, root, 'child1');

console.log('Path:' + child1.getPath());


console.log(root);
let loop = new ScopeData({}, root, 'loop',true);
console.log(root);

let inst1= new ScopeData({val:111}, loop);
console.log(root);

let inst2 = new ScopeData({ val: 2 }, loop);
console.log(root);
let child2=new ScopeData({ name: 'jones' }, inst2 , 'child2');

console.log('Child 2Path:' + child2.getPath());
let path = 'root.' + child2.getPath();
console.log(eval(path));

/*
decompose(root);
decompose(child1);

*/
function decompose(obj) {
    console.log('========Before ==========');
    console.log(obj);
    console.log('Path:'+obj.getPath());
    console.log('========After ==========');
    obj._data = null;
    let state = JSON.stringify(obj);
    let obj2 = JSON.parse(state);

    console.log(obj2);

}