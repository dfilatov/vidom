import patchOps from '../client/patchOps';
import domAttrs from '../client/domAttrs';
import ns from '../client/utils/ns';
import checkReuse from './utils/checkReuse';
import checkChildren from './utils/checkChildren';
import patchChildren from './utils/patchChildren';
import { addListener, removeListeners } from '../client/events/domEventManager';
import ATTRS_TO_EVENTS from '../client/events/attrsToEvents';
import escapeHtml from '../utils/escapeHtml';
import isInArray from '../utils/isInArray';
import emptyObj from '../utils/emptyObj';
import merge from '../utils/merge';
import { isTrident, isEdge } from '../client/utils/ua';
import createElement from '../client/utils/createElement';
import createElementByHtml from '../client/utils/createElementByHtml';
import restrictObjProp from '../utils/restrictObjProp';
import { IS_DEBUG } from '../utils/debug';
import { ELEMENT_TYPE_TAG } from './utils/elementTypes';
import normalizeNode from './utils/normalizeNode';

const SHORT_TAGS = [
        'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input',
        'keygen', 'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr'
    ].reduce(
        (res, tag) => {
            res[tag] = true;
            return res;
        },
        Object.create(null)),
    USE_DOM_STRINGS = isTrident || isEdge;

export default function TagElement(tag, key, attrs, children, ref, escapeChildren) {
    if(IS_DEBUG) {
        restrictObjProp(this, 'type');
        restrictObjProp(this, 'tag');
        restrictObjProp(this, 'key');
        restrictObjProp(this, 'attrs');
        restrictObjProp(this, 'children');
        restrictObjProp(this, 'ref');

        this.__isFrozen = false;
    }

    this.type = ELEMENT_TYPE_TAG;
    this.tag = tag;
    this.key = key == null? null : key;
    this.attrs = attrs || emptyObj;
    this.children = processChildren(children);
    this.ref = ref == null? null : ref;

    if(IS_DEBUG) {
        checkAttrs(this.attrs);

        Object.freeze(this.attrs);
        if(Array.isArray(this.children)) {
            Object.freeze(this.children);
        }

        this.__isFrozen = true;
    }

    this._domNode = null;
    this._ns = tag in ns? ns[tag] : null;
    this._escapeChildren = escapeChildren !== false;
    this._ctx = emptyObj;
}

TagElement.prototype = {
    getDomNode() {
        return this._domNode;
    },

    setCtx(ctx) {
        if(ctx !== emptyObj) {
            this._ctx = ctx;

            const { children } = this;

            if(children !== null && typeof children !== 'string') {
                const len = children.length;
                let i = 0;

                while(i < len) {
                    children[i++].setCtx(ctx);
                }
            }
        }

        return this;
    },

    renderToDom(parentNs) {
        if(IS_DEBUG) {
            checkReuse(this, this.tag);
        }

        const { tag, children } = this,
            ns = this._ns || parentNs;

        if(USE_DOM_STRINGS && children && typeof children !== 'string') {
            const domNode = createElementByHtml(this.renderToString(), tag, ns);

            this.adoptDom([domNode], 0);
            return domNode;
        }

        const domNode = this._domNode = createElement(tag, ns),
            { attrs } = this;

        if(children !== null) {
            if(typeof children === 'string') {
                this._escapeChildren?
                    domNode.textContent = children :
                    domNode.innerHTML = children;
            }
            else {
                let i = 0;
                const len = children.length;

                while(i < len) {
                    domNode.appendChild(children[i++].renderToDom(ns));
                }
            }
        }

        if(attrs !== emptyObj) {
            let name, value;

            for(name in attrs) {
                if((value = attrs[name]) != null) {
                    if(name in ATTRS_TO_EVENTS) {
                        addListener(domNode, ATTRS_TO_EVENTS[name], value);
                    }
                    else {
                        domAttrs(name).set(domNode, name, value);
                    }
                }
            }
        }

        return domNode;
    },

    renderToString() {
        const { tag } = this;

        if(tag === '!') {
            return '<!---->';
        }

        const ns = this._ns,
            { attrs } = this;
        let { children } = this,
            res = '<' + tag;

        if(ns !== null) {
            res += ' xmlns="' + ns + '"';
        }

        if(attrs !== emptyObj) {
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
                                this.setCtx({ value, multiple : attrs.multiple });
                                continue;

                            case 'option':
                                const ctx = this._ctx;

                                if(ctx.multiple? isInArray(ctx.value, value) : ctx.value === value) {
                                    res += ' ' + domAttrs('selected').toString('selected', true);
                                }
                        }
                    }

                    if(!(name in ATTRS_TO_EVENTS) && (attrHtml = domAttrs(name).toString(name, value)) !== '') {
                        res += ' ' + attrHtml;
                    }
                }
            }
        }

        if(tag in SHORT_TAGS) {
            res += '/>';
        }
        else {
            res += '>';

            if(children !== null) {
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

    adoptDom(domNodes, domIdx) {
        if(IS_DEBUG) {
            checkReuse(this, this.tag);
        }

        const domNode = this._domNode = domNodes[domIdx],
            { attrs, children } = this;

        if(attrs !== emptyObj) {
            let name, value;
            for(name in attrs) {
                if((value = attrs[name]) != null && name in ATTRS_TO_EVENTS) {
                    addListener(domNode, ATTRS_TO_EVENTS[name], value);
                }
            }
        }

        if(children !== null && typeof children !== 'string') {
            let i = 0;
            const len = children.length;

            if(len > 0) {
                const domChildren = domNode.childNodes;
                let domChildIdx = 0;

                while(i < len) {
                    domChildIdx = children[i++].adoptDom(domChildren, domChildIdx);
                }
            }
        }

        return domIdx + 1;
    },

    mount() {
        const { children } = this;

        if(children !== null && typeof children !== 'string') {
            let i = 0;
            const len = children.length;

            while(i < len) {
                children[i++].mount();
            }
        }

        if(this.ref !== null) {
            this.ref(this._domNode);
        }
    },

    unmount() {
        const { children } = this;

        if(children && typeof children !== 'string') {
            let i = 0;
            const len = children.length;

            while(i < len) {
                children[i++].unmount();
            }
        }

        removeListeners(this._domNode);

        this._domNode = null;

        if(this.ref !== null) {
            this.ref(null);
        }
    },

    clone(attrs, children, ref) {
        const res = new TagElement(this.tag, this.key);

        if(IS_DEBUG) {
            res.__isFrozen = false;
        }

        res.attrs = attrs == null? this.attrs : merge(this.attrs, attrs);
        res.children = children == null? this.children : processChildren(children);
        res.ref = ref == null? this.ref : ref;

        if(IS_DEBUG) {
            res.__isFrozen = true;
        }

        res._escapeChildren = this._escapeChildren;
        res._ctx = this._ctx;

        return res;
    },

    patch(element) {
        if(this === element) {
            this._patchChildren(element);
        }
        else if(this.type === element.type && this.tag === element.tag && this._ns === element._ns) {
            element._domNode = this._domNode;
            this._patchAttrs(element);
            this._patchChildren(element);
            this._patchRef(element);
        }
        else {
            patchOps.replace(this, element);
        }
    },

    _patchChildren(element) {
        const childrenA = this.children,
            childrenB = element.children;

        if(childrenA === null && childrenB === null) {
            return;
        }

        const isChildrenAText = typeof childrenA === 'string',
            isChildrenBText = typeof childrenB === 'string';

        if(isChildrenBText) {
            if(isChildrenAText) {
                if(childrenA !== childrenB) {
                    patchOps.updateText(this, childrenB, element._escapeChildren);
                }
                return;
            }

            if(childrenA !== null && childrenA.length > 0) {
                patchOps.removeChildren(this);
            }

            if(childrenB !== '') {
                patchOps.updateText(this, childrenB, element._escapeChildren);
            }

            return;
        }

        if(childrenB === null || childrenB.length === 0) {
            if(childrenA) {
                if(isChildrenAText) {
                    patchOps.removeText(this);
                }
                else if(childrenA.length > 0) {
                    patchOps.removeChildren(this);
                }
            }

            return;
        }

        if(isChildrenAText && childrenA !== '') {
            patchOps.removeText(this);
        }

        if(isChildrenAText || childrenA === null || childrenA.length === 0) {
            const childrenBLen = childrenB.length;
            let iB = 0;

            while(iB < childrenBLen) {
                patchOps.appendChild(element, childrenB[iB++]);
            }

            return;
        }

        patchChildren(this, element);
    },

    _patchAttrs(element) {
        const attrsA = this.attrs,
            attrsB = element.attrs;

        if(attrsA === attrsB) {
            return;
        }

        let attrName;

        if(attrsB !== emptyObj) {
            let attrAVal, attrBVal, isAttrAValArray, isAttrBValArray;

            for(attrName in attrsB) {
                attrBVal = attrsB[attrName];
                if(attrsA === emptyObj || (attrAVal = attrsA[attrName]) == null) {
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

        if(attrsA !== emptyObj) {
            for(attrName in attrsA) {
                if((attrsB === emptyObj || !(attrName in attrsB)) && attrsA[attrName] != null) {
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

        if(hasDiff) {
            patchOps.updateAttr(this, attrName, arrB);
        }
    },

    _patchAttrObj(attrName, objA, objB) {
        if(objA === objB) {
            return;
        }

        const diffObj = Object.create(null);
        let hasDiff = false;

        for(const i in objB) {
            if(objA[i] != objB[i]) {
                hasDiff = true;
                diffObj[i] = objB[i];
            }
        }

        for(const i in objA) {
            if(objA[i] != null && !(i in objB)) {
                hasDiff = true;
                diffObj[i] = null;
            }
        }

        if(hasDiff) {
            patchOps.updateAttr(this, attrName, diffObj);
        }
    },

    _patchRef(element) {
        if(this.ref !== null) {
            if(this.ref !== element.ref) {
                this.ref(null);

                if(element.ref !== null) {
                    element.ref(element._domNode);
                }
            }
        }
        else if(element.ref !== null) {
            element.ref(element._domNode);
        }
    }
};

function processChildren(children) {
    const normalizedChildren = normalizeNode(children),
        res = normalizedChildren !== null &&
                typeof normalizedChildren === 'object' &&
                !Array.isArray(normalizedChildren)?
            [normalizedChildren] :
            normalizedChildren;

    if(IS_DEBUG) {
        if(Array.isArray(res)) {
            checkChildren(res);
        }
    }

    return res;
}

function checkAttrs(attrs) {
    for(const name in attrs) {
        if(name.substr(0, 2) === 'on' && !(name in ATTRS_TO_EVENTS)) {
            throw Error(`vidom: Unsupported type of dom event listener "${name}".`);
        }
    }
}
