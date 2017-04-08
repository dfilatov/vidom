import SimpleMap from '../../utils/SimpleMap';

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

        const nativeEvent = this.nativeEvent;

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

const eventsPool = new SimpleMap();

export default function createSyntheticEvent(type, nativeEvent) {
    if(eventsPool.has(type)) {
        const pooledEvent = eventsPool.get(type);

        if(!pooledEvent._isPersisted) {
            pooledEvent.target = nativeEvent.target;
            pooledEvent.nativeEvent = nativeEvent;
            pooledEvent._isPropagationStopped = false;
            pooledEvent._isDefaultPrevented = false;

            return pooledEvent;
        }
    }

    const res = new SyntheticEvent(type, nativeEvent);

    eventsPool.set(type, res);

    return res;
}
