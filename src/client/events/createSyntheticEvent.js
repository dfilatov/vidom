function SyntheticEvent(type, nativeEvent) {
    this.type = type;
    this.target = nativeEvent.target;
    this.nativeEvent = nativeEvent;

    this._isPropagationStopped = false;
    this._isDefaultPrevented = false;
    this._isPersisted = false;
}

SyntheticEvent.prototype = {
    stopPropagation() {
        this._isPropagationStopped = true;

        const nativeEvent = this.nativeEvent;

        nativeEvent.stopPropagation?
            nativeEvent.stopPropagation() :
            nativeEvent.cancelBubble = true;
    },

    isPropagationStopped() {
        return this._isPropagationStopped;
    },

    preventDefault() {
        this._isDefaultPrevented = true;

        const nativeEvent = this.nativeEvent;

        nativeEvent.preventDefault?
            nativeEvent.preventDefault() :
            nativeEvent.returnValue = false;
    },

    isDefaultPrevented() {
        return this._isDefaultPrevented;
    },

    persist() {
        this._isPersisted = true;
    }
};

const eventsPool = {};

export default function createSyntheticEvent(type, nativeEvent) {
    const pooledEvent = eventsPool[type];

    if(pooledEvent && !pooledEvent._isPersisted) {
        pooledEvent.target = nativeEvent.target;
        pooledEvent.nativeEvent = nativeEvent;
        pooledEvent._isPropagationStopped = false;
        pooledEvent._isDefaultPrevented = false;

        return pooledEvent;
    }

    return eventsPool[type] = new SyntheticEvent(type, nativeEvent);
}
