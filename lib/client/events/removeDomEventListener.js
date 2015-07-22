function removeEventListenerFromDom(domNode, type, fn) {
    domNode.removeEventListener(type, fn);
}

module.exports = removeEventListenerFromDom;
