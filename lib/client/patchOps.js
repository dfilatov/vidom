var domAttrsMutators = require('./domAttrsMutators'),
    domEventManager = require('./events/domEventManager'),
    ATTRS_TO_EVENTS = require('./events/attrsToEvents');

function appendChild(parentNode, childNode) {
    parentNode.getDomNode().appendChild(childNode.renderToDom(parentNode));
    childNode.mount();
}

function insertChild(parentNode, childNode, beforeChildNode) {
    parentNode.getDomNode().insertBefore(childNode.renderToDom(parentNode), beforeChildNode.getDomNode());
    childNode.mount();
}

function removeChild(parentNode, childNode) {
    var childDomNode = childNode.getDomNode();
    childNode.unmount();
    parentNode.getDomNode().removeChild(childDomNode);
}

function moveChild(parentNode, childNode, toChildNode, after) {
    var parentDomNode = parentNode.getDomNode(),
        childDomNode = childNode.getDomNode(),
        toChildDomNode = toChildNode.getDomNode();

    if(after) {
        var nextSiblingDomNode = toChildDomNode.nextSibling;
        nextSiblingDomNode?
            parentDomNode.insertBefore(childDomNode, nextSiblingDomNode) :
            parentDomNode.appendChild(childDomNode);
    }
    else {
        parentDomNode.insertBefore(childDomNode, toChildDomNode);
    }
}

function removeChildren(parentNode) {
    var j = 0,
        childNodes = parentNode._children,
        len = childNodes.length;

    while(j < len) {
        childNodes[j++].unmount();
    }

    parentNode.getDomNode().innerHTML = '';
}

function replace(parentNode, oldNode, newNode) {
    var oldDomNode = oldNode.getDomNode(),
        newDomNode = newNode.renderToDom(parentNode);

    oldNode.unmount();
    oldDomNode.parentNode.replaceChild(newDomNode, oldDomNode);
    newNode.mount();
    return newDomNode;
}

function updateAttr(node, attrName, attrVal) {
    var domNode = node.getDomNode();

    ATTRS_TO_EVENTS[attrName]?
        domEventManager.addListener(domNode, ATTRS_TO_EVENTS[attrName], attrVal) :
        domAttrsMutators(attrName).set(domNode, attrName, attrVal);
}

function removeAttr(node, attrName) {
    var domNode = node.getDomNode();

    ATTRS_TO_EVENTS[attrName]?
        domEventManager.removeListener(domNode, ATTRS_TO_EVENTS[attrName]) :
        domAttrsMutators(attrName).remove(domNode, attrName);
}

function updateText(node, text) {
    node.getDomNode().nodeValue = text;
}

module.exports = {
    appendChild : appendChild,
    insertChild : insertChild,
    removeChild : removeChild,
    moveChild : moveChild,
    removeChildren : removeChildren,
    replace : replace,
    updateAttr : updateAttr,
    removeAttr : removeAttr,
    updateText : updateText
};
