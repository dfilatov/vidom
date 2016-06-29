import emptyObj from '../utils/emptyObj';
import { NODE_TYPE_COMPONENT } from './utils/nodeTypes';

export default function ComponentNode(component) {
    this.type = NODE_TYPE_COMPONENT;
    this._component = component;
    this._key = null;
    this._attrs = null;
    this._instance = null;
    this._children = null;
    this._ns = null;
    this._ctx = emptyObj;
}

ComponentNode.prototype = {
    getDomNode() {
        return this._instance.getDomNode();
    },

    key(key) {
        this._key = key;
        return this;
    },

    attrs(attrs) {
        this._attrs = attrs;
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
        return this._getInstance().renderToDom(parentNs);
    },

    renderToString() {
        return this._getInstance().renderToString();
    },

    adoptDom(domNode, domIdx) {
        return this._getInstance().adoptDom(domNode, domIdx);
    },

    mount() {
        this._instance.getRootNode().mount();
        this._instance.mount();
    },

    unmount() {
        if(this._instance) {
            this._instance.getRootNode().unmount();
            this._instance.unmount();
            this._instance = null;
        }
    },

    patch(node) {
        if(this === node) {
            return;
        }

        const instance = this._getInstance();

        if(this.type === node.type) {
            if(this._component === node._component) {
                instance.patch(node._attrs, node._children, node._ctx);
                node._instance = instance;
            }
            else {
                instance.unmount();
                const newInstance = node._getInstance();
                instance.getRootNode().patch(newInstance.getRootNode());
                newInstance.mount();
            }
        }
        else {
            instance.unmount();
            instance.getRootNode().patch(node);
        }
    },

    _getInstance() {
        return this._instance || (this._instance = new this._component(this._attrs, this._children, this._ctx));
    }
};
