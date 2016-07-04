const doc = global.document,
    elementProtos = {};

export default function createElement(tag, ns) {
    let baseElement;

    if(ns) {
        const key = ns + ':' + tag;

        baseElement = elementProtos[key] || (elementProtos[key] = doc.createElementNS(ns, tag));
    }
    else {
        baseElement = elementProtos[tag] ||
            (elementProtos[tag] = tag === '!'? doc.createComment('') : doc.createElement(tag));
    }

    return baseElement.cloneNode();
}
