const doc = global.document;

function isEventSupported(type) {
    const eventProp = 'on' + type;

    if(eventProp in doc) {
        return true;
    }

    const domNode = doc.createElement('div');

    domNode.setAttribute(eventProp, 'return;');
    if(typeof domNode[eventProp] === 'function') {
        return true;
    }

    return type === 'wheel' &&
        doc.implementation &&
        doc.implementation.hasFeature &&
        doc.implementation.hasFeature('', '') !== true &&
        doc.implementation.hasFeature('Events.wheel', '3.0');
}

export default isEventSupported;
