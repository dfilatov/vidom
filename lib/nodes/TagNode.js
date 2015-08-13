import patchOps from '../client/patchOps';
import domAttrsMutators from '../client/domAttrsMutators';
import { addListener, removeListener, removeListeners } from '../client/events/domEventManager';
import ATTRS_TO_EVENTS from '../client/events/attrsToEvents';
import escapeHtml from '../utils/escapeHtml';
import isInArray from '../utils/isInArray';

const doc = typeof document !== 'undefined'? document : null,
    SHORT_TAGS = {
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
    };

class TagNode {
    constructor(tag) {
        this.type = TagNode;
        this._tag = tag;
        this._domNode = null;
        this._key = null;
        this._ns = null;
        this._attrs = null;
        this._children = null;
        this._escapeChildren = true;
        this._parentNode = null;
    }

    getDomNode() {
        return this._domNode;
    }

    key(key) {
        this._key = key;
        return this;
    }

    ns(ns) {
        this._ns = ns;
        return this;
    }

    attrs(attrs) {
        this._attrs = attrs;
        return this;
    }

    children(children) {
        this._children = processChildren(children);
        return this;
    }

    html(html) {
        this._children = html;
        this._escapeChildren = false;
        return this;
    }

    renderToDom(parentNode) {
        if(parentNode) {
            this._parentNode = parentNode;
            this._ns || (this._ns = parentNode._ns);
        }

        const domNode = createElement(this._ns, this._tag),
            children = this._children,
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
                        domAttrsMutators(name).set(domNode, name, value));
            }
        }

        return this._domNode = domNode;
    }

    renderToString(ctx) {
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
                                ctx = { value : value, multiple : attrs.multiple };
                                continue;

                            case 'option':
                                if(ctx.multiple? isInArray(ctx.value, value) : ctx.value === value) {
                                    res += ' ' + domAttrsMutators('selected').toString('selected', true);
                                }
                        }
                    }

                    if(attrHtml = domAttrsMutators(name).toString(name, value)) {
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
                        res += children[i++].renderToString(ctx);
                    }
                }
            }

            res += '</' + tag + '>';
        }

        return res;
    }

    adoptDom(domNode, parentNode) {
        if(parentNode) {
            this._parentNode = parentNode;
            this._ns || (this._ns = parentNode._ns);
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
    }

    mount() {
        const children = this._children;

        if(children && typeof children !== 'string') {
            let i = 0;
            const len = children.length;

            while(i < len) {
                children[i++].mount();
            }
        }
    }

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
        this._parentNode = null;
    }

    patch(node) {
        if(this.type !== node.type || this._tag !== node._tag || this._ns !== node._ns) {
            patchOps.replace(this._parentNode, this, node);
            return;
        }

        this._patchChildren(node);
        this._patchAttrs(node);

        this._domNode && (node._domNode = this._domNode);
    }

    _patchChildren(node) {
        const childrenA = this._children,
            childrenB = node._children;

        if(!childrenA && !childrenB) {
            return;
        }

        const isChildrenAText = typeof childrenA === 'string',
            isChildrenBText = typeof childrenB === 'string';

        if(isChildrenBText) {
            if(isChildrenAText) {
                if(childrenA !== childrenB) {
                    patchOps.updateText(this, childrenB, node._escapeChildren);
                }
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
                patchOps.appendChild(this, childrenB[iB++]);
            }
            return;
        }

        const childrenALen = childrenA.length;

        if(childrenALen === 1 && childrenBLen === 1) {
            childrenA[0].patch(childrenB[0]);
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
                leftChildA.patch(leftChildB);
                updateLeftIdxA = true;
                updateLeftIdxB = true;
            }
            else if(rightChildAKey === rightChildBKey) {
                rightChildA.patch(rightChildB);
                updateRightIdxA = true;
                updateRightIdxB = true;
            }
            else if(leftChildAKey != null && leftChildAKey === rightChildBKey) {
                moveChild(this, leftChildA, rightChildA, true);
                leftChildA.patch(rightChildB);
                updateLeftIdxA = true;
                updateRightIdxB = true;
            }
            else if(rightChildAKey != null && rightChildAKey === leftChildBKey) {
                moveChild(this, rightChildA, leftChildA, false);
                rightChildA.patch(leftChildB);
                updateRightIdxA = true;
                updateLeftIdxB = true;
            }
            else if(leftChildAKey != null && leftChildBKey == null) {
                patchOps.insertChild(this, leftChildB, leftChildA);
                updateLeftIdxB = true;
            }
            else if(leftChildAKey == null && leftChildBKey != null) {
                patchOps.removeChild(this, leftChildA);
                updateLeftIdxA = true;
            }
            else {
                childrenAKeys || (childrenAKeys = buildKeys(childrenA, leftIdxA, rightIdxA));
                if((foundAChildIdx = childrenAKeys[leftChildBKey]) != null) {
                    foundAChild = childrenA[foundAChildIdx];
                    childrenAIndicesToSkip[foundAChildIdx] = true;
                    moveChild(this, foundAChild, leftChildA, false);
                    foundAChild.patch(leftChildB);
                }
                else {
                    patchOps.insertChild(this, leftChildB, leftChildA);
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
                patchOps.removeChild(this, childrenA[leftIdxA]);
            }
            ++leftIdxA;
        }

        while(leftIdxB <= rightIdxB) {
            rightIdxB < childrenBLen - 1?
                patchOps.insertChild(this, childrenB[leftIdxB], childrenB[rightIdxB + 1]) :
                patchOps.appendChild(this, childrenB[leftIdxB]);
            ++leftIdxB;
        }
    }

    _patchAttrs(node) {
        const attrsA = this._attrs,
            attrsB = node._attrs;

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
    }

    _patchAttrArr(attrName, arrA, arrB) {
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
    }

    _patchAttrObj(attrName, objA, objB) {
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
}

let elementProtos = {};
function createElement(ns, tag) {
    let baseElement;
    if(ns) {
        const key = ns + ':' + tag;
        baseElement = elementProtos[key] || (elementProtos[key] = doc.createElementNS(ns, tag));
    }
    else {
        baseElement = elementProtos[tag] || (elementProtos[tag] = doc.createElement(tag));
    }

    return baseElement.cloneNode();
}

function moveChild(parentNode, childNode, toChildNode, after) {
    const activeElement = doc.activeElement;
    patchOps.moveChild(parentNode, childNode, toChildNode, after);
    if(doc.activeElement !== activeElement) {
        activeElement.focus();
    }
}

function processChildren(children) {
    if(!children) {
        return null;
    }

    const typeOfChildren = typeof children;

    return typeOfChildren === 'object'?
        Array.isArray(children)? children : [children] :
        typeOfChildren === 'string'? children : children.toString();
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

export default TagNode;
