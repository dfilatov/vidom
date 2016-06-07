import patchOps from '../client/patchOps';
import domAttrs from '../client/domAttrs';
import domOps from '../client/domOps';
import normalizeNs from './utils/normalizeNs';
import checkChildren from './utils/checkChildren';
import patchChildren from './utils/patchChildren';
import { addListener, removeListeners } from '../client/events/domEventManager';
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
        normalizeNs(this, parentNode);

        const children = this._children;

        if(USE_DOM_STRINGS && children && typeof children !== 'string') {
            const domNode = createElementByHtml(this.renderToString(), this._tag, this._ns);
            this.adoptDom([domNode], 0, parentNode);
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
                    domOps.append(domNode, children[i++].renderToDom(this));
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

    adoptDom(domNodes, domIdx, parentNode) {
        normalizeNs(this, parentNode);

        const domNode = this._domNode = domNodes[domIdx],
            attrs = this._attrs,
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
                let domChildIdx = 0;

                while(i < len) {
                    domChildIdx = children[i++].adoptDom(domChildren, domChildIdx, this);
                }
            }
        }

        return domIdx + 1;
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

        normalizeNs(node, parentNode);

        switch(node.type) {
            case TagNode:
                if(this._tag !== node._tag || this._ns !== node._ns) {
                    patchOps.replace(parentNode, this, node);
                }
                else {
                    node._domNode = this._domNode;
                    this._patchChildren(node);
                    this._patchAttrs(node);
                }
                break;

            case ComponentNode:
                const instance = node._getInstance();
                this.patch(instance.getRootNode(), parentNode);
                instance.mount();
                break;

            case FunctionComponentNode:
                this.patch(node._getRootNode(), parentNode);
                break;

            default:
                patchOps.replace(parentNode, this, node);
        }
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

        if(isChildrenAText || !childrenA || !childrenA.length) {
            const childrenBLen = childrenB.length;
            let iB = 0;

            while(iB < childrenBLen) {
                patchOps.appendChild(node, childrenB[iB++]);
            }

            return;
        }

        patchChildren(this, node);
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
                if(!attrsA || (attrAVal = attrsA[attrName]) == null) {
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
                if((!attrsB || !(attrName in attrsB)) && (attrAVal = attrsA[attrName]) != null) {
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

        if(lenA === arrB.length) {
            let i = 0;
            while(!hasDiff && i < lenA) {
                if(arrA[i] != arrB[i]) {
                    hasDiff = true;
                }
                ++i;
            }
        }
        else {
            hasDiff = true;
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

function checkAttrs(attrs) {
    for(let name in attrs) {
        if(name.substr(0, 2) === 'on' && !ATTRS_TO_EVENTS[name]) {
            console.error(`You\'re trying to add unsupported event listener "${name}".`);
        }
    }
}
