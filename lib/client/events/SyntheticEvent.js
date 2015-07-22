function SyntheticEvent(type, nativeEvent) {
    this.type = type;
    this.target = nativeEvent.target;
    this.nativeEvent = nativeEvent;

    this._isPropagationStopped = false;
    this._isDefaultPrevented = false;
}

SyntheticEvent.prototype = {
    stopPropagation : function() {
        this._isPropagationStopped = true;

        var nativeEvent = this.nativeEvent;
        nativeEvent.stopPropagation?
            nativeEvent.stopPropagation() :
            nativeEvent.cancelBubble = true;
    },

    isPropagationStopped : function() {
        return this._isPropagationStopped;
    },

    preventDefault : function() {
        this._isDefaultPrevented = true;

        var nativeEvent = this.nativeEvent;
        nativeEvent.preventDefault?
            nativeEvent.preventDefault() :
            nativeEvent.returnValue = false;
    },

    isDefaultPrevented : function() {
        return this._isDefaultPrevented;
    }
};

module.exports = SyntheticEvent;
