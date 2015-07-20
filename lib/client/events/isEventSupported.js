function isEventSupported(type) {
    var eventProp = 'on' + type;

    if(eventProp in document) {
        return true;
    }

    var domNode = document.createElement('div');

    domNode.setAttribute(eventProp, 'return;');
    if(typeof domNode[eventProp] === 'function') {
        return true;
    }

    return type === 'wheel' &&
        document.implementation &&
        document.implementation.hasFeature &&
        document.implementation.hasFeature('', '') !== true &&
        document.implementation.hasFeature('Events.wheel', '3.0');
}

module.exports = isEventSupported;
