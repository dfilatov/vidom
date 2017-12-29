const elementProtos = Object.create(null);

export default function createElement(tag, ns) {
    let baseElement;

    if(ns === null) {
        baseElement = tag in elementProtos?
            elementProtos[tag] :
            elementProtos[tag] = tag === '!'?
                document.createComment('') :
                document.createElement(tag);
    }
    else {
        const key = `${ns}:${tag}`;

        baseElement = key in elementProtos?
            elementProtos[key] :
            elementProtos[key] = document.createElementNS(ns, tag);
    }

    return baseElement.cloneNode();
}
