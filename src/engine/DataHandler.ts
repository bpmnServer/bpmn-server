class DataHandler
{
// Data Handling 
    /*
     * renamed from applyInput to appendData
     */
    static appendData(instanceData,inputData,item, dataPath = null,assignment=null) {
        let asArray = false;

        if (Array.isArray(inputData))
            asArray = true;

        if (dataPath && dataPath.endsWith('[]')) {
            asArray = true;
        }

        let target = DataHandler.getAndCreateData(instanceData,dataPath, asArray);

                if (!target) {
            item.token.error("*** Error *** target is not defined");
            return;
        }

        if (inputData) {
            if (asArray) {
                target.push(inputData);
            }
            else {
                Object.keys(inputData).forEach(key => {
                    const val = inputData[key];
                    if (key.startsWith('vars.')) {
                        delete inputData[key];
                        if (item)
                            item.vars[key.substring(5)] = val;
                    }
                    else
                        target[key] = val;
                });
            }
        }
    }

    static getData(instanceData,dataPath) {
        let target = instanceData;

        if (dataPath) {
            dataPath.split('.').forEach(de => {
                // strip off []
                de=de.replace('[]', '');
                if (de != '')
                    target = target[de];
            });
        }
        return target;
    }
    static getAndCreateData(instanceData,dataPath, asArray = false) {

        let target = instanceData;

        if (dataPath) {
            dataPath.split('.').forEach(de => {
                if (de != '') {
                    de = de.replace('[]', '');
                    if (!target[de]) {
                        if (asArray) 
                                target[de] = [];
                        else 
                                target[de] = {};
                    }
                    target = target[de];

                }
            });
        }
        return target;
    }
}

export { DataHandler }