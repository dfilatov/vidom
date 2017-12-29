function Emitter() {
    this._listeners = Object.create(null);
}

Emitter.prototype = {
    on(event, fn, fnCtx = null) {
        (this._listeners[event] || (this._listeners[event] = [])).push({ fn, fnCtx });

        return this;
    },

    off(event, fn, fnCtx = null) {
        const eventListeners = this._listeners[event];

        if(eventListeners) {
            let i = 0,
                eventListener;

            while(i < eventListeners.length) {
                eventListener = eventListeners[i];
                if(eventListener.fn === fn && eventListener.fnCtx === fnCtx) {
                    eventListeners.splice(i, 1);
                    break;
                }

                i++;
            }
        }

        return this;
    },

    emit(event, ...args) {
        const eventListeners = this._listeners[event];

        if(eventListeners) {
            let i = 0;

            while(i < eventListeners.length) {
                const { fn, fnCtx } = eventListeners[i++];

                fn.call(fnCtx, ...args);
            }
        }

        return this;
    }
};

export default Emitter;
