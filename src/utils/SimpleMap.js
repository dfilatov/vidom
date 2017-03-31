let SimpleMap;

if(typeof Map === 'undefined') {
    SimpleMap = function(items) {
        this._storage = {};

        if(items) {
            for(let i = 0; i < items.length; i++) {
                this._storage[items[i][0]] = items[i][1];
            }
        }
    };

    SimpleMap.prototype = {
        has(key) {
            return key in this._storage;
        },

        get(key) {
            return this._storage[key];
        },

        set(key, value) {
            this._storage[key] = value;
            return this;
        },

        delete(key) {
            return delete this._storage[key];
        },

        forEach(callback, thisArg) {
            const storage = this._storage;

            for(const key in storage) {
                callback.call(thisArg, storage[key], key, this);
            }
        }
    };
}
else {
    SimpleMap = Map;
}

export default SimpleMap;
