import domAttrs from './domAttrs';
import domOps from './domOps';
import { disableListeners, enableListeners } from './events/domEventManager';
import { getNs, getParentNs } from './utils/ns';
import { addListener, removeListener } from './events/domEventManager';
import ATTRS_TO_EVENTS from './events/attrsToEvents';

function appendChild(parentElement, childElement) {
    const parentDomNode = parentElement.getDomNode();

    domOps.append(parentDomNode, childElement.renderToDom(getNs(parentDomNode)));
    childElement.mount();
}

function insertChild(childElement, beforeChildElement) {
    const beforeChildDomNode = beforeChildElement.getDomNode();

    domOps.insertBefore(
        childElement.renderToDom(getParentNs(beforeChildDomNode)),
        beforeChildDomNode);
    childElement.mount();
}

function removeChild(childElement) {
    const childDomNode = childElement.getDomNode();

    childElement.unmount();
    domOps.remove(childDomNode);
}

function moveChild(childElement, toChildelement, after) {
    const activeDomNode = document.activeElement;

    disableListeners();

    domOps.move(childElement.getDomNode(), toChildelement.getDomNode(), after);

    if(document.activeElement !== activeDomNode) {
        activeDomNode.focus();
    }

    enableListeners();
}

function removeChildren(parentElement) {
    const parentDomNode = parentElement.getDomNode(),
        childNodes = parentElement.children,
        len = childNodes.length;

    let j = 0;

    while(j < len) {
        childNodes[j++].unmount();
    }

    domOps.removeChildren(parentDomNode);
}

function replace(oldElement, newElement) {
    const oldDomNode = oldElement.getDomNode();

    oldElement.unmount();
    domOps.replace(oldDomNode, newElement.renderToDom(getParentNs(oldDomNode)));
    newElement.mount();
}

function updateAttr(element, attrName, attrVal) {
    const domNode = element.getDomNode();

    if(attrName in ATTRS_TO_EVENTS) {
        addListener(domNode, ATTRS_TO_EVENTS[attrName], attrVal);
    }
    else {
        domAttrs(attrName).set(domNode, attrName, attrVal);
    }
}

function removeAttr(element, attrName) {
    const domNode = element.getDomNode();

    if(attrName in ATTRS_TO_EVENTS) {
        removeListener(domNode, ATTRS_TO_EVENTS[attrName]);
    }
    else {
        domAttrs(attrName).remove(domNode, attrName);
    }
}

function updateText(element, text, escape) {
    domOps.updateText(element.getDomNode(), text, escape);
}

function removeText(element) {
    domOps.removeText(element.getDomNode());
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
};
