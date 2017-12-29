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

        const { nativeEvent } = this;

        if(nativeEvent.stopPropagation) {
            nativeEvent.stopPropagation();
        }
        else {
            nativeEvent.cancelBubble = true;
        }
    },

    isPropagationStopped() {
        return this._isPropagationStopped;
    },

    preventDefault() {
        this._isDefaultPrevented = true;

        const { nativeEvent } = this;

        if(nativeEvent.preventDefault) {
            nativeEvent.preventDefault();
        }
        else {
            nativeEvent.returnValue = false;
        }
    },

    isDefaultPrevented() {
        return this._isDefaultPrevented;
    },

    persist() {
        this._isPersisted = true;
    }
};

const eventsPool = Object.create(null);

export default function createSyntheticEvent(type, nativeEvent) {
    if(type in eventsPool) {
        const pooledEvent = eventsPool[type];

        if(!pooledEvent._isPersisted) {
            pooledEvent.target = nativeEvent.target;
            pooledEvent.nativeEvent = nativeEvent;
            pooledEvent._isPropagationStopped = false;
            pooledEvent._isDefaultPrevented = false;

            return pooledEvent;
        }
    }

    return eventsPool[type] = new SyntheticEvent(type, nativeEvent);
}
