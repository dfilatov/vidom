import patchOps from '../client/patchOps';
import createNode from '../createNode';
import checkReuse from './utils/checkReuse';
import console from '../utils/console';
import emptyObj from '../utils/emptyObj';
import merge from '../utils/merge';
import restrictObjProp from '../utils/restrictObjProp';
import { IS_DEBUG } from '../utils/debug';
import { NODE_TYPE_FUNCTION_COMPONENT } from './utils/nodeTypes';
import { setKey } from './utils/setters';
import isNode from './utils/isNode';

const ATTRS_SET = 4,
    CHILDREN_SET = 8;

export default function FunctionComponentNode(component) {
    if(IS_DEBUG) {
        restrictObjProp(this, 'type');
        restrictObjProp(this, 'key');
        restrictObjProp(this, 'attrs');
        restrictObjProp(this, 'children');

        this.__isFrozen = false;
    }

    this.type = NODE_TYPE_FUNCTION_COMPONENT;
    this.component = component;
    this.key = null;
    this.attrs = emptyObj;
    this.children = null;

    if(IS_DEBUG) {
        this.__isFrozen = true;
        this._sets = 0;
    }

    this._rootNode = null;
    this._ctx = emptyObj;
}

FunctionComponentNode.prototype = {
    getDomNode() {
        return this._rootNode === null?
            null:
            this._rootNode.getDomNode();
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

        return this._getRootNode().renderToDom(parentNs);
    },

    renderToString() {
        return this._getRootNode().renderToString();
    },

    adoptDom(domNode, domIdx) {
        if(IS_DEBUG) {
            checkReuse(this, this.component.name || 'Anonymous');
        }

        return this._getRootNode().adoptDom(domNode, domIdx);
    },

    mount() {
        this._getRootNode().mount();
    },

    unmount() {
        if(this._rootNode !== null) {
            this._rootNode.unmount();
            this._rootNode = null;
        }
    },

    clone() {
        const res = new FunctionComponentNode(this.component);

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

    patch(node) {
        if(this === node) {
            const prevRootNode = this._getRootNode();

            this._rootNode = null;
            prevRootNode.patch(this._getRootNode());
        }
        else if(this.type === node.type && this.component === node.component) {
            this._getRootNode().patch(node._getRootNode());
            this._rootNode = null;
        }
        else {
            patchOps.replace(this, node);
            this._rootNode = null;
        }
    },

    _getRootNode() {
        if(this._rootNode !== null) {
            return this._rootNode;
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

        const res = component(resAttrs, this.children, this._ctx),
            rootNode = res === null? createNode('!') : res;

        if(IS_DEBUG) {
            if(!isNode(rootNode)) {
                const name = component.name || 'Function';

                throw Error(`vidom: ${name} component must return a single node or null on the top level.`);
            }
        }

        rootNode.setCtx(this._ctx);

        return this._rootNode = rootNode;
    }
};

if(IS_DEBUG) {
    FunctionComponentNode.prototype.setRef = function() {
        throw Error('vidom: Function component nodes don\'t support refs.');
    };
}
