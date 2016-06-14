import emptyObj from '../utils/emptyObj';
import normalizeNs from './utils/normalizeNs';

export default function ComponentNode(component) {
    this.type = ComponentNode;
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

    renderToDom(parent) {
        normalizeNs(this, parent);

        return this._getInstance().renderToDom(this);
    },

    renderToString() {
        return this._getInstance().renderToString();
    },

    adoptDom(domNode, domIdx, parentNode) {
        return this._getInstance().adoptDom(domNode, domIdx, parentNode);
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

    patch(node, parentNode) {
        if(this === node) {
            return;
        }

        normalizeNs(node, parentNode);

        const instance = this._getInstance();

        if(this.type === node.type) {
            if(this._component === node._component) {
                instance.patch(node._attrs, node._children, node._ctx, parentNode);
                node._instance = instance;
            }
            else {
                instance.unmount();
                const newInstance = node._getInstance();
                instance.getRootNode().patch(newInstance.getRootNode(), parentNode);
                newInstance.mount();
            }
        }
        else {
            instance.unmount();
            instance.getRootNode().patch(node, parentNode);
        }
    },

    _getInstance() {
        return this._instance || (this._instance = new this._component(this._attrs, this._children, this._ctx));
    }
};
