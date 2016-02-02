export default function SyntheticEvent(type, nativeEvent) {
    this.type = type;
    this.target = nativeEvent.target;
    this.nativeEvent = nativeEvent;

    this._isPropagationStopped = false;
    this._isDefaultPrevented = false;
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
    }
};
