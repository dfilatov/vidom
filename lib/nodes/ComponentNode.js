import patchOps from '../client/patchOps';

class ComponentNode {
    constructor(component) {
        this.type = ComponentNode;
        this._component = component;
        this._key = null;
        this._attrs = null;
        this._instance = null;
        this._children = null;
        this._ns = null;
        this._parentNode = null;
    }

    getDomNode() {
        return this._instance._domNode;
    }

    key(key) {
        this._key = key;
        return this;
    }

    attrs(attrs) {
        this._attrs = attrs;
        return this;
    }

    children(children) {
        this._children = children;
        return this;
    }

    renderToDom(parentNode) {
        if(parentNode) {
            this._parentNode = parentNode;
            this._ns || (this._ns = parentNode._ns);
        }

        return this._domNode = this._getInstance().renderToDom(this);
    }

    renderToString(ctx) {
        return this._getInstance().renderToString(ctx);
    }

    adoptDom(domNode, parentNode) {
        this._getInstance().adoptDom(domNode, parentNode);
    }

    mount() {
        this._instance.mount();
    }

    unmount() {
        if(this._instance) {
            this._instance.unmount();
            this._instance = null;
        }

        this._parentNode = null;
    }

    patch(node) {
        if(this.type !== node.type || this._component !== node._component) {
            patchOps.replace(this._parentNode, this, node);
            return;
        }

        let instance = this._getInstance();

        instance.patch(node._attrs, node._children);
        node._instance = instance;
    }

    _getInstance() {
        return this._instance || (this._instance = new this._component(this._attrs, this._children));
    }
}

export default ComponentNode;
