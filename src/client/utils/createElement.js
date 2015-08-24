const doc = global.document,
    elementProtos = {};

function createElement(ns, tag) {
    let baseElement;
    if(ns) {
        const key = ns + ':' + tag;
        baseElement = elementProtos[key] || (elementProtos[key] = doc.createElementNS(ns, tag));
    }
    else {
        baseElement = elementProtos[tag] || (elementProtos[tag] = doc.createElement(tag));
    }

    return baseElement.cloneNode();
}

export default createElement;
