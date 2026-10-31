class DataObject {
    data;
    _data;
    _other='abc'
    dataHandler;
    constructor(defaultValue) {
        this._other=defaultValue;
        this._data={x:'x'};
        let self=this;
        this.dataHandler = {
            get(targetData, prop, receiver) {
                console.log('receiver',receiver,targetData,prop,self);
                let t=targetData;
                while(t) {
                    if (t[prop]) 
                        return t[prop];
                    else
                        return self._other;
                
                }
            }
        };
        this.data =new Proxy(this._data,this.dataHandler);
    }
}  

const dobj=new DataObject('123');
const dobj2=new DataObject('abc');
console.log(dobj.data.x,dobj.data.z,dobj2.data.z);

/*
const data1={a:'a',b:'b'};
const _data2={x:'x'};
const token1={data:{a:'a',b:'b'}};
const token2={data:{x:'x'},parentToken:token1};
const data2=new Proxy(_data2,dataHandler);

console.log('data2',data2.x,data2.a);
*/