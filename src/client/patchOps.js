import domAttrs from './domAttrs';
import domOps from './domOps';
import { addListener, removeListener } from './events/domEventManager';
import ATTRS_TO_EVENTS from './events/attrsToEvents';

const doc = global.document;

function appendChild(parentNode, childNode) {
    domOps.append(parentNode.getDomNode(), childNode.renderToDom(parentNode));
    childNode.mount();
}

function insertChild(parentNode, childNode, beforeChildNode) {
    domOps.insertBefore(childNode.renderToDom(parentNode), beforeChildNode.getDomNode());
    childNode.mount();
}

function removeChild(childNode) {
    const childDomNode = childNode.getDomNode();

    childNode.unmount();
    domOps.remove(childDomNode);
}

function moveChild(childNode, toChildNode, after) {
    const activeDomNode = doc.activeElement;

    domOps.move(childNode.getDomNode(), toChildNode.getDomNode(), after);

    if(doc.activeElement !== activeDomNode) {
        activeDomNode.focus();
    }
}

function removeChildren(parentNode) {
    const childNodes = parentNode._children,
        len = childNodes.length;

    let j = 0;

    while(j < len) {
        childNodes[j++].unmount();
    }

    domOps.removeChildren(parentNode.getDomNode());
}

function replace(parentNode, oldNode, newNode) {
    const oldDomNode = oldNode.getDomNode();

    oldNode.unmount();
    domOps.replace(oldDomNode, newNode.renderToDom(parentNode));
    newNode.mount();
}

function updateAttr(node, attrName, attrVal) {
    const domNode = node.getDomNode();

    ATTRS_TO_EVENTS[attrName]?
        addListener(domNode, ATTRS_TO_EVENTS[attrName], attrVal) :
        domAttrs(attrName).set(domNode, attrName, attrVal);
}

function removeAttr(node, attrName) {
    const domNode = node.getDomNode();

    ATTRS_TO_EVENTS[attrName]?
        removeListener(domNode, ATTRS_TO_EVENTS[attrName]) :
        domAttrs(attrName).remove(domNode, attrName);
}

function updateText(node, text, escape) {
    const domNode = node.getDomNode();

    if(escape) {
        const firstChild = domNode.firstChild;

        firstChild?
            firstChild.nodeValue = text :
            domNode.textContent = text;
    }
    else {
        domNode.innerHTML = text;
    }
}

function removeText(parentNode) {
    parentNode.getDomNode().innerHTML = '';
}

export default {
    appendChild,
    insertChild,
    removeChild,
    moveChild,
    removeChildren,
    replace,
    updateAttr,
    removeAttr,
    updateText,
    removeText
}
