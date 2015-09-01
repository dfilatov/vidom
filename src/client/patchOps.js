import domAttrs from './domAttrs';
import { addListener, removeListener } from './events/domEventManager';
import ATTRS_TO_EVENTS from './events/attrsToEvents';

const doc = global.document;

function appendChild(parentNode, childNode) {
    parentNode.getDomNode().appendChild(childNode.renderToDom(parentNode));
    childNode.mount();
}

function insertChild(parentNode, childNode, beforeChildNode) {
    parentNode.getDomNode().insertBefore(childNode.renderToDom(parentNode), beforeChildNode.getDomNode());
    childNode.mount();
}

function removeChild(parentNode, childNode) {
    const childDomNode = childNode.getDomNode();
    childNode.unmount();
    parentNode.getDomNode().removeChild(childDomNode);
}

function moveChild(parentNode, childNode, toChildNode, after) {
    const parentDomNode = parentNode.getDomNode(),
        childDomNode = childNode.getDomNode(),
        toChildDomNode = toChildNode.getDomNode(),
        activeDomNode = doc.activeElement;

    if(after) {
        const nextSiblingDomNode = toChildDomNode.nextSibling;
        nextSiblingDomNode?
            parentDomNode.insertBefore(childDomNode, nextSiblingDomNode) :
            parentDomNode.appendChild(childDomNode);
    }
    else {
        parentDomNode.insertBefore(childDomNode, toChildDomNode);
    }

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

    parentNode.getDomNode().innerHTML = '';
}

function replace(parentNode, oldNode, newNode) {
    const oldDomNode = oldNode.getDomNode();

    oldNode.unmount();
    oldDomNode.parentNode.replaceChild(newNode.renderToDom(parentNode), oldDomNode);
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
    escape?
        domNode.textContent = text :
        domNode.innerHTML = text;
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
