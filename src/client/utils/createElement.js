import SimpleMap from '../../utils/SimpleMap';

const elementProtos = new SimpleMap();

export default function createElement(tag, ns) {
    let baseElement;

    if(ns === null) {
        if(elementProtos.has(tag)) {
            baseElement = elementProtos.get(tag);
        }
        else {
            elementProtos.set(
                tag,
                baseElement = tag === '!'?
                    document.createComment('') :
                    document.createElement(tag));
        }
    }
    else {
        const key = `${ns}:${tag}`;

        if(elementProtos.has(key)) {
            baseElement = elementProtos.get(key);
        }
        else {
            elementProtos.set(
                key,
                baseElement = document.createElementNS(ns, tag));
        }
    }

    return baseElement.cloneNode();
}
