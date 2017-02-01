import patchOps from '../client/patchOps';
import createNode from '../createNode';
import checkReuse from './utils/checkReuse';
import console from '../utils/console';
import emptyObj from '../utils/emptyObj';
import merge from '../utils/merge';
import { IS_DEBUG } from '../utils/debug';
import { NODE_TYPE_FUNCTION_COMPONENT } from './utils/nodeTypes';

export default function FunctionComponentNode(component) {
    this.type = NODE_TYPE_FUNCTION_COMPONENT;
    this._component = component;
    this._key = null;
    this._attrs = null;
    this._children = null;
    this._rootNode = null;
    this._ctx = emptyObj;
}

FunctionComponentNode.prototype = {
    getDomNode() {
        return this._rootNode && this._rootNode.getDomNode();
    },

    key(key) {
        this._key = key;
        return this;
    },

    attrs(attrs) {
        this._attrs = this._attrs? merge(this._attrs, attrs) : attrs;
        return this;
    },

    children(children) {
        this._children = children;
        return this;
    },

    ctx(ctx) {
        this._ctx = ctx;
        return this;
    },

    renderToDom(parentNs) {
        if(IS_DEBUG) {
            checkReuse(this, this._component.name || 'Anonymous');
        }

        return this._getRootNode().renderToDom(parentNs);
    },

    renderToString() {
        return this._getRootNode().renderToString();
    },

    adoptDom(domNode, domIdx) {
        if(IS_DEBUG) {
            checkReuse(this, this._component.name || 'Anonymous');
        }

        return this._getRootNode().adoptDom(domNode, domIdx);
    },

    mount() {
        this._getRootNode().mount();
    },

    unmount() {
        if(this._rootNode) {
            this._rootNode.unmount();
            this._rootNode = null;
        }
    },

    clone() {
        const res = new FunctionComponentNode(this._component);

        res._key = this._key;
        res._attrs = this._attrs;
        res._children = this._children;
        res._ctx = this._ctx;

        return res;
    },

    patch(node) {
        if(this === node) {
            const prevRootNode = this._getRootNode();

            this._rootNode = null;
            prevRootNode.patch(this._getRootNode());
        }
        else if(this.type === node.type && this._component === node._component) {
            this._getRootNode().patch(node._getRootNode());
            this._rootNode = null;
        }
        else {
            patchOps.replace(this, node);
            this._rootNode = null;
        }
    },

    _getRootNode() {
        if(this._rootNode) {
            return this._rootNode;
        }

        const rootNode = this._component(this._attrs || emptyObj, this._children, this._ctx) || createNode('!');

        if(IS_DEBUG) {
            if(typeof rootNode !== 'object' || Array.isArray(rootNode)) {
                console.error('Function component must return a single node object on the top level');
            }
        }

        rootNode.ctx(this._ctx);

        return this._rootNode = rootNode;
    }
};

if(IS_DEBUG) {
    FunctionComponentNode.prototype.ref = function() {
        console.error('Function component nodes don\'t support refs.');
        return this;
    };
}
