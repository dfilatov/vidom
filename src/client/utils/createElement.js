const elementProtos = {};

export default function createElement(tag, ns) {
    let baseElement;

    if(ns) {
        const key = ns + ':' + tag;

        baseElement = elementProtos[key] || (elementProtos[key] = document.createElementNS(ns, tag));
    }
    else {
        baseElement = elementProtos[tag] ||
            (elementProtos[tag] = tag === '!'? document.createComment('') : document.createElement(tag));
    }

    return baseElement.cloneNode();
}
