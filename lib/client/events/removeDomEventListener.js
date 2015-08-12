function removeEventListenerFromDom(domNode, type, fn) {
    domNode.removeEventListener(type, fn);
}

export default removeEventListenerFromDom;
