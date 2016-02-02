import patchOps from '../client/patchOps';
import domAttrs from '../client/domAttrs';
import { addListener, removeListener, removeListeners } from '../client/events/domEventManager';
import ATTRS_TO_EVENTS from '../client/events/attrsToEvents';
import escapeHtml from '../utils/escapeHtml';
import isInArray from '../utils/isInArray';
import console from '../utils/console';
import emptyObj from '../utils/emptyObj';
import { isTrident, isEdge } from '../client/browsers';
import createElement from '../client/utils/createElement';
import createElementByHtml from '../client/utils/createElementByHtml';
import ComponentNode from './ComponentNode';
import FunctionComponentNode from './FunctionComponentNode';

const SHORT_TAGS = {
        area : true,
        base : true,
        br : true,
        col : true,
        command : true,
        embed : true,
        hr : true,
        img : true,
        input : true,
        keygen : true,
        link : true,
        menuitem : true,
        meta : true,
        param : true,
        source : true,
        track : true,
        wbr : true
    },
    USE_DOM_STRINGS = isTrident || isEdge;

export default function TagNode(tag) {
    this.type = TagNode;
    this._tag = tag;
    this._domNode = null;
    this._key = null;
    this._ns = null;
    this._attrs = null;
    this._children = null;
    this._escapeChildren = true;
    this._ctx = emptyObj;
}

TagNode.prototype = {
    getDomNode() {
        return this._domNode;
    },

    key(key) {
        this._key = key;
        return this;
    },

    ns(ns) {
        this._ns = ns;
        return this;
    },

    attrs(attrs) {
        this._attrs = attrs;

        if(process.env.NODE_ENV !== 'production') {
            checkAttrs(attrs);
        }

        return this;
    },

    children(children) {
        if(process.env.NODE_ENV !== 'production') {
            if(this._children !== null) {
                console.warn('You\'re trying to set children or html more than once or pass both children and html.');
            }
        }

        this._children = processChildren(children);
        return this;
    },

    ctx(ctx) {
        if(ctx !== emptyObj) {
            this._ctx = ctx;

            const children = this._children;

            if(children && typeof children !== 'string') {
                const len = children.length;
                let i = 0;

                while(i < len) {
                    children[i++].ctx(ctx);
                }
            }
        }

        return this;
    },

    html(html) {
        if(process.env.NODE_ENV !== 'production') {
            if(this._children !== null) {
                console.warn('You\'re trying to set children or html more than once or pass both children and html.');
            }
        }

        this._children = html;
        this._escapeChildren = false;
        return this;
    },

    renderToDom(parentNode) {
        if(!this._ns && parentNode && parentNode._ns) {
            this._ns = parentNode._ns;
        }

        const children = this._children;

        if(USE_DOM_STRINGS && children && typeof children !== 'string') {
            const domNode = createElementByHtml(this.renderToString(), this._tag, this._ns);
            this.adoptDom(domNode, parentNode);
            return domNode;
        }

        const domNode = createElement(this._ns, this._tag),
            attrs = this._attrs;

        if(children) {
            if(typeof children === 'string') {
                this._escapeChildren?
                    domNode.textContent = children :
                    domNode.innerHTML = children;
            }
            else {
                let i = 0;
                const len = children.length;

                while(i < len) {
                    domNode.appendChild(children[i++].renderToDom(this));
                }
            }
        }

        if(attrs) {
            let name, value;
            for(name in attrs) {
                (value = attrs[name]) != null &&
                    (ATTRS_TO_EVENTS[name]?
                        addListener(domNode, ATTRS_TO_EVENTS[name], value) :
                        domAttrs(name).set(domNode, name, value));
            }
        }

        return this._domNode = domNode;
    },

    renderToString() {
        const tag = this._tag,
            ns = this._ns,
            attrs = this._attrs;

        let children = this._children,
            res = '<' + tag;

        if(ns) {
            res += ' xmlns="' + ns + '"';
        }

        if(attrs) {
            let name, value, attrHtml;
            for(name in attrs) {
                value = attrs[name];

                if(value != null) {
                    if(name === 'value') {
                        switch(tag) {
                            case 'textarea':
                                children = value;
                                continue;

                            case 'select':
                                this.ctx({ value, multiple : attrs.multiple });
                                continue;

                            case 'option':
                                if(this._ctx.multiple? isInArray(this._ctx.value, value) : this._ctx.value === value) {
                                    res += ' ' + domAttrs('selected').toString('selected', true);
                                }
                        }
                    }

                    if(!ATTRS_TO_EVENTS[name] && (attrHtml = domAttrs(name).toString(name, value))) {
                        res += ' ' + attrHtml;
                    }
                }
            }
        }

        if(SHORT_TAGS[tag]) {
            res += '/>';
        }
        else {
            res += '>';

            if(children) {
                if(typeof children === 'string') {
                    res += this._escapeChildren?
                        escapeHtml(children) :
                        children;
                }
                else {
                    let i = 0;
                    const len = children.length;

                    while(i < len) {
                        res += children[i++].renderToString();
                    }
                }
            }

            res += '</' + tag + '>';
        }

        return res;
    },

    adoptDom(domNode, parentNode) {
        if(!this._ns && parentNode && parentNode._ns) {
            this._ns = parentNode._ns;
        }

        this._domNode = domNode;

        const attrs = this._attrs,
            children = this._children;

        if(attrs) {
            let name, value;
            for(name in attrs) {
                if((value = attrs[name]) != null && ATTRS_TO_EVENTS[name]) {
                    addListener(domNode, ATTRS_TO_EVENTS[name], value);
                }
            }
        }

        if(children && typeof children !== 'string') {
            let i = 0;
            const len = children.length;

            if(len) {
                const domChildren = domNode.childNodes;
                while(i < len) {
                    children[i].adoptDom(domChildren[i], this);
                    ++i;
                }
            }
        }
    },

    mount() {
        const children = this._children;

        if(children && typeof children !== 'string') {
            let i = 0;
            const len = children.length;

            while(i < len) {
                children[i++].mount();
            }
        }
    },

    unmount() {
        const children = this._children;

        if(children && typeof children !== 'string') {
            let i = 0;
            const len = children.length;

            while(i < len) {
                children[i++].unmount();
            }
        }

        removeListeners(this._domNode);

        this._domNode = null;
    },

    patch(node, parentNode) {
        if(this === node) {
            return;
        }

        if(!node._ns && parentNode && parentNode._ns) {
            node._ns = parentNode._ns;
        }

        if(this.type !== node.type) {
            switch(node.type) {
                case ComponentNode:
                    const instance = node._getInstance();
                    this.patch(instance.getRootNode(), parentNode);
                    instance.mount();
                break;

                case FunctionComponentNode:
                    this.patch(node._getRootNode(), parentNode);
                break;

                default:
                    patchOps.replace(parentNode || null, this, node);
            }
            return;
        }

        if(this._tag !== node._tag || this._ns !== node._ns) {
            patchOps.replace(parentNode || null, this, node);
            return;
        }

        this._domNode && (node._domNode = this._domNode);

        this._patchChildren(node);
        this._patchAttrs(node);
    },

    _patchChildren(node) {
        const childrenA = this._children,
            childrenB = node._children;

        if(childrenA === childrenB) {
            return;
        }

        const isChildrenAText = typeof childrenA === 'string',
            isChildrenBText = typeof childrenB === 'string';

        if(isChildrenBText) {
            if(isChildrenAText) {
                patchOps.updateText(this, childrenB, node._escapeChildren);
                return;
            }

            childrenA && childrenA.length && patchOps.removeChildren(this);
            childrenB && patchOps.updateText(this, childrenB, node._escapeChildren);

            return;
        }

        if(!childrenB || !childrenB.length) {
            if(childrenA) {
                isChildrenAText?
                    patchOps.removeText(this) :
                    childrenA.length && patchOps.removeChildren(this);
            }

            return;
        }

        if(isChildrenAText && childrenA) {
            patchOps.removeText(this);
        }

        const childrenBLen = childrenB.length;

        if(isChildrenAText || !childrenA || !childrenA.length) {
            let iB = 0;
            while(iB < childrenBLen) {
                patchOps.appendChild(node, childrenB[iB++]);
            }
            return;
        }

        const childrenALen = childrenA.length;

        if(childrenALen === 1 && childrenBLen === 1) {
            childrenA[0].patch(childrenB[0], node);
            return;
        }

        let leftIdxA = 0,
            rightIdxA = childrenALen - 1,
            leftChildA = childrenA[leftIdxA],
            leftChildAKey = leftChildA._key,
            rightChildA = childrenA[rightIdxA],
            rightChildAKey = rightChildA._key,
            leftIdxB = 0,
            rightIdxB = childrenBLen - 1,
            leftChildB = childrenB[leftIdxB],
            leftChildBKey = leftChildB._key,
            rightChildB = childrenB[rightIdxB],
            rightChildBKey = rightChildB._key,
            updateLeftIdxA = false,
            updateRightIdxA = false,
            updateLeftIdxB = false,
            updateRightIdxB = false,
            childrenAIndicesToSkip = {},
            childrenAKeys, foundAChildIdx, foundAChild;

        while(leftIdxA <= rightIdxA && leftIdxB <= rightIdxB) {
            if(childrenAIndicesToSkip[leftIdxA]) {
                updateLeftIdxA = true;
            }
            else if(childrenAIndicesToSkip[rightIdxA]) {
                updateRightIdxA = true;
            }
            else if(leftChildAKey === leftChildBKey) {
                leftChildA.patch(leftChildB, node);
                updateLeftIdxA = true;
                updateLeftIdxB = true;
            }
            else if(rightChildAKey === rightChildBKey) {
                rightChildA.patch(rightChildB, node);
                updateRightIdxA = true;
                updateRightIdxB = true;
            }
            else if(leftChildAKey != null && leftChildAKey === rightChildBKey) {
                patchOps.moveChild(node, leftChildA, rightChildA, true);
                leftChildA.patch(rightChildB, node);
                updateLeftIdxA = true;
                updateRightIdxB = true;
            }
            else if(rightChildAKey != null && rightChildAKey === leftChildBKey) {
                patchOps.moveChild(node, rightChildA, leftChildA, false);
                rightChildA.patch(leftChildB, node);
                updateRightIdxA = true;
                updateLeftIdxB = true;
            }
            else if(leftChildAKey != null && leftChildBKey == null) {
                patchOps.insertChild(node, leftChildB, leftChildA);
                updateLeftIdxB = true;
            }
            else if(leftChildAKey == null && leftChildBKey != null) {
                patchOps.removeChild(node, leftChildA);
                updateLeftIdxA = true;
            }
            else {
                childrenAKeys || (childrenAKeys = buildKeys(childrenA, leftIdxA, rightIdxA));
                if((foundAChildIdx = childrenAKeys[leftChildBKey]) != null) {
                    foundAChild = childrenA[foundAChildIdx];
                    childrenAIndicesToSkip[foundAChildIdx] = true;
                    patchOps.moveChild(node, foundAChild, leftChildA, false);
                    foundAChild.patch(leftChildB, node);
                }
                else {
                    patchOps.insertChild(node, leftChildB, leftChildA);
                }
                updateLeftIdxB = true;
            }

            if(updateLeftIdxA) {
                updateLeftIdxA = false;
                if(++leftIdxA <= rightIdxA) {
                    leftChildA = childrenA[leftIdxA];
                    leftChildAKey = leftChildA._key;
                }
            }

            if(updateRightIdxA) {
                updateRightIdxA = false;
                if(--rightIdxA >= leftIdxA) {
                    rightChildA = childrenA[rightIdxA];
                    rightChildAKey = rightChildA._key;
                }
            }

            if(updateLeftIdxB) {
                updateLeftIdxB = false;
                if(++leftIdxB <= rightIdxB) {
                    leftChildB = childrenB[leftIdxB];
                    leftChildBKey = leftChildB._key;
                }
            }

            if(updateRightIdxB) {
                updateRightIdxB = false;
                if(--rightIdxB >= leftIdxB) {
                    rightChildB = childrenB[rightIdxB];
                    rightChildBKey = rightChildB._key;
                }
            }
        }

        while(leftIdxA <= rightIdxA) {
            if(!childrenAIndicesToSkip[leftIdxA]) {
                patchOps.removeChild(node, childrenA[leftIdxA]);
            }
            ++leftIdxA;
        }

        while(leftIdxB <= rightIdxB) {
            rightIdxB < childrenBLen - 1?
                patchOps.insertChild(node, childrenB[leftIdxB], childrenB[rightIdxB + 1]) :
                patchOps.appendChild(node, childrenB[leftIdxB]);
            ++leftIdxB;
        }
    },

    _patchAttrs(node) {
        const attrsA = this._attrs,
            attrsB = node._attrs;

        if(attrsA === attrsB) {
            return;
        }

        let attrName, attrAVal, attrBVal,
            isAttrAValArray, isAttrBValArray;

        if(attrsB) {
            for(attrName in attrsB) {
                attrBVal = attrsB[attrName];
                if(!attrsA || ((attrAVal = attrsA[attrName]) == null)) {
                    if(attrBVal != null) {
                        patchOps.updateAttr(this, attrName, attrBVal);
                    }
                }
                else if(attrBVal == null) {
                    patchOps.removeAttr(this, attrName);
                }
                else if(typeof attrBVal === 'object' && typeof attrAVal === 'object') {
                    isAttrBValArray = Array.isArray(attrBVal);
                    isAttrAValArray = Array.isArray(attrAVal);
                    if(isAttrBValArray || isAttrAValArray) {
                        if(isAttrBValArray && isAttrAValArray) {
                            this._patchAttrArr(attrName, attrAVal, attrBVal);
                        }
                        else {
                            patchOps.updateAttr(this, attrName, attrBVal);
                        }
                    }
                    else {
                        this._patchAttrObj(attrName, attrAVal, attrBVal);
                    }
                }
                else if(attrAVal !== attrBVal) {
                    patchOps.updateAttr(this, attrName, attrBVal);
                }
            }
        }

        if(attrsA) {
            for(attrName in attrsA) {
                if((!attrsB || !(attrName in attrsB)) && ((attrAVal = attrsA[attrName]) != null)) {
                    patchOps.removeAttr(this, attrName);
                }
            }
        }
    },

    _patchAttrArr(attrName, arrA, arrB) {
        if(arrA === arrB) {
            return;
        }

        const lenA = arrA.length;
        let hasDiff = false;

        if(lenA !== arrB.length) {
            hasDiff = true;
        }
        else {
            let i = 0;
            while(!hasDiff && i < lenA) {
                if(arrA[i] != arrB[i]) {
                    hasDiff = true;
                }
                ++i;
            }
        }

        hasDiff && patchOps.updateAttr(this, attrName, arrB);
    },

    _patchAttrObj(attrName, objA, objB) {
        if(objA === objB) {
            return;
        }

        let hasDiff = false,
            diffObj = {};

        for(let i in objB) {
            if(objA[i] != objB[i]) {
                hasDiff = true;
                diffObj[i] = objB[i];
            }
        }

        for(let i in objA) {
            if(objA[i] != null && !(i in objB)) {
                hasDiff = true;
                diffObj[i] = null;
            }
        }

        hasDiff && patchOps.updateAttr(this, attrName, diffObj);
    }
};

function processChildren(children) {
    if(children == null) {
        return null;
    }

    const typeOfChildren = typeof children;

    if(typeOfChildren === 'object') {
        const res = Array.isArray(children)? children : [children];

        if(process.env.NODE_ENV !== 'production') {
            checkChildren(res);
        }

        return res;
    }

    return typeOfChildren === 'string'?
        children :
        children.toString();
}

function checkChildren(children) {
    const keys = {},
        len = children.length;

    let i = 0,
        child;

    while(i < len) {
        child = children[i++];

        if(typeof child !== 'object') {
            console.error('You mustn\'t use simple child in case of multiple children.');
        }
        else if(child._key != null) {
            if(child._key in keys) {
                console.error(
                    `Childrens\' keys must be unique across the children. Found duplicate of "${child._key}" key.`);
            }
            else {
                keys[child._key] = true;
            }
        }
    }
}

function buildKeys(children, idxFrom, idxTo) {
    let res = {},
        child;

    while(idxFrom < idxTo) {
        child = children[idxFrom];
        child._key != null && (res[child._key] = idxFrom);
        ++idxFrom;
    }

    return res;
}

function checkAttrs(attrs) {
    for(let name in attrs) {
        if(name.substr(0, 2) === 'on' && !ATTRS_TO_EVENTS[name]) {
            console.error(`You\'re trying to add unsupported event listener "${name}".`);
        }
    }
}
