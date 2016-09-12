import domAttrs from './domAttrs';
import domOps from './domOps';
import { disableListeners, enableListeners } from './events/domEventManager';
import { getNs, getParentNs } from './utils/ns';
import { addListener, removeListener } from './events/domEventManager';
import ATTRS_TO_EVENTS from './events/attrsToEvents';

function appendChild(parentNode, childNode) {
    const parentDomNode = parentNode.getDomNode();

    domOps.append(parentDomNode, childNode.renderToDom(getNs(parentDomNode)));
    childNode.mount();
}

function insertChild(childNode, beforeChildNode) {
    const beforeChildDomNode = beforeChildNode.getDomNode();

    domOps.insertBefore(
        childNode.renderToDom(getParentNs(beforeChildDomNode)),
        beforeChildDomNode);
    childNode.mount();
}

function removeChild(childNode) {
    const childDomNode = childNode.getDomNode();

    childNode.unmount();
    domOps.remove(childDomNode);
}

function moveChild(childNode, toChildNode, after) {
    const activeDomNode = document.activeElement;

    disableListeners();

    domOps.move(childNode.getDomNode(), toChildNode.getDomNode(), after);

    if(document.activeElement !== activeDomNode) {
        activeDomNode.focus();
    }

    enableListeners();
}

function removeChildren(parentNode) {
    const parentDomNode = parentNode.getDomNode(),
        childNodes = parentNode._children,
        len = childNodes.length;

    let j = 0;

    while(j < len) {
        childNodes[j++].unmount();
    }

    domOps.removeChildren(parentDomNode);
}

function replace(oldNode, newNode) {
    const oldDomNode = oldNode.getDomNode();

    oldNode.unmount();
    domOps.replace(oldDomNode, newNode.renderToDom(getParentNs(oldDomNode)));
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
    domOps.updateText(node.getDomNode(), text, escape);
}

function removeText(node) {
    domOps.removeText(node.getDomNode());
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
