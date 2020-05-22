"use strict";
//
//-----------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstancesCache = void 0;
let InstancesCache = /** @class */ (() => {
    class InstancesCache {
        static getList() {
            let items = [];
            InstancesCache.liveInstances.forEach(item => { items.push(item); });
            return items;
        }
        /**
        **/
        static getInstance(instanceId) {
            let instance = InstancesCache.liveInstances.get(instanceId);
            return instance;
        }
        static add(instance, engine) {
            InstancesCache.liveInstances.set(instance.id, { instance, engine });
        }
        static remove(instanceId) {
            InstancesCache.liveInstances.delete(instanceId);
        }
    }
    InstancesCache.liveInstances = new Map();
    return InstancesCache;
})();
exports.InstancesCache = InstancesCache;
//# sourceMappingURL=InstancesCache.js.map