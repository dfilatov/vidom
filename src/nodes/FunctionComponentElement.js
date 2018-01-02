import patchOps from '../client/patchOps';
import checkReuse from './utils/checkReuse';
import console from '../utils/console';
import emptyObj from '../utils/emptyObj';
import merge from '../utils/merge';
import restrictObjProp from '../utils/restrictObjProp';
import { IS_DEBUG } from '../utils/debug';
import { ELEMENT_TYPE_FUNCTION_COMPONENT } from './utils/elementTypes';
import nodeToElement from './utils/nodeToElement';
import { setKey } from './utils/setters';

const ATTRS_SET = 4,
    CHILDREN_SET = 8;

export default function FunctionComponentElement(component) {
    if(IS_DEBUG) {
        restrictObjProp(this, 'type');
        restrictObjProp(this, 'key');
        restrictObjProp(this, 'attrs');
        restrictObjProp(this, 'children');

        this.__isFrozen = false;
    }

    this.type = ELEMENT_TYPE_FUNCTION_COMPONENT;
    this.component = component;
    this.key = null;
    this.attrs = emptyObj;
    this.children = null;

    if(IS_DEBUG) {
        this.__isFrozen = true;
        this._sets = 0;
    }

    this._rootElement = null;
    this._ctx = emptyObj;
}

FunctionComponentElement.prototype = {
    getDomNode() {
        return this._rootElement === null?
            null:
            this._rootElement.getDomNode();
    },

    setKey,

    setAttrs(attrs) {
        if(IS_DEBUG) {
            if(this._sets & ATTRS_SET) {
                console.warn('Attrs are already set and shouldn\'t be set again.');
            }

            this.__isFrozen = false;
        }

        if(attrs != null) {
            this.attrs = this.attrs === emptyObj? attrs : merge(this.attrs, attrs);

            if(IS_DEBUG) {
                Object.freeze(this.attrs);
                this._sets |= ATTRS_SET;
                this.__isFrozen = true;
            }
        }

        return this;
    },

    setChildren(children) {
        if(IS_DEBUG) {
            if(this._sets & CHILDREN_SET) {
                console.warn('Children are already set and shouldn\'t be set again.');
            }

            this.__isFrozen = false;
        }

        this.children = children;

        if(IS_DEBUG) {
            this._sets |= CHILDREN_SET;
            this.__isFrozen = true;
        }

        return this;
    },

    setCtx(ctx) {
        this._ctx = ctx;
        return this;
    },

    renderToDom(parentNs) {
        if(IS_DEBUG) {
            checkReuse(this, this.component.name || 'Anonymous');
        }

        return this._getRootElement().renderToDom(parentNs);
    },

    renderToString() {
        return this._getRootElement().renderToString();
    },

    adoptDom(domNode, domIdx) {
        if(IS_DEBUG) {
            checkReuse(this, this.component.name || 'Anonymous');
        }

        return this._getRootElement().adoptDom(domNode, domIdx);
    },

    mount() {
        this._getRootElement().mount();
    },

    unmount() {
        if(this._rootElement !== null) {
            this._rootElement.unmount();
            this._rootElement = null;
        }
    },

    clone() {
        const res = new FunctionComponentElement(this.component);

        if(IS_DEBUG) {
            res.__isFrozen = false;
        }

        res.key = this.key;
        res.attrs = this.attrs;
        res.children = this.children;

        if(IS_DEBUG) {
            res.__isFrozen = true;
        }

        res._ctx = this._ctx;

        return res;
    },

    patch(element) {
        if(this === element) {
            const prevRootElement = this._getRootElement();

            this._rootElement = null;
            prevRootElement.patch(this._getRootElement());
        }
        else if(this.type === element.type && this.component === element.component) {
            this._getRootElement().patch(element._getRootElement());
            this._rootElement = null;
        }
        else {
            patchOps.replace(this, element);
            this._rootElement = null;
        }
    },

    _getRootElement() {
        if(this._rootElement !== null) {
            return this._rootElement;
        }

        const { attrs, component } = this,
            { defaultAttrs } = component,
            hasDefaultAttrs = defaultAttrs != null,
            resAttrs = attrs === emptyObj?
                hasDefaultAttrs? defaultAttrs : attrs :
                hasDefaultAttrs? merge(defaultAttrs, attrs) : attrs;

        if(IS_DEBUG) {
            Object.freeze(resAttrs);
        }

        this._rootElement = nodeToElement(component(resAttrs, this.children, this._ctx));
        this._rootElement.setCtx(this._ctx);

        return this._rootElement;
    }
};

if(IS_DEBUG) {
    FunctionComponentElement.prototype.setRef = function() {
        throw Error('vidom: Function component elements don\'t support refs.');
    };
}
