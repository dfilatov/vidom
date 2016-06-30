const DEFAULT_NS_URI = 'http://www.w3.org/1999/xhtml';

export function getNs(domNode) {
    return Array.isArray(domNode)?
        getParentNs(domNode) :
        domNode.namespaceURI === DEFAULT_NS_URI?
            null :
            domNode.namespaceURI;
}

export function getParentNs(domNode) {
    return getNs((Array.isArray(domNode)? domNode[domNode.length - 1] : domNode).parentNode);
}
