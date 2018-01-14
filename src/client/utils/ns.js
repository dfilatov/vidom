const NS = Object.create(null);

NS.html = 'http://www.w3.org/1999/xhtml';
NS.svg = 'http://www.w3.org/2000/svg';
NS.math = 'http://www.w3.org/1998/Math/MathML';

export default NS;

export function getNs(domNode) {
    return Array.isArray(domNode)?
        getParentNs(domNode) :
        domNode.namespaceURI === NS.html?
            null :
            domNode.namespaceURI;
}

export function getParentNs(domNode) {
    return getNs((Array.isArray(domNode)? domNode[domNode.length - 1] : domNode).parentNode);
}
