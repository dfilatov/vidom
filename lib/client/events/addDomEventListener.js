function addEventListenerToDom(domNode, type, fn, useCapture) {
    domNode.addEventListener(type, fn, useCapture);
}

module.exports = addEventListenerToDom;
