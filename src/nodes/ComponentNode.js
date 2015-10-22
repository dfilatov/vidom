class ComponentNode {
    constructor(component) {
        this.type = ComponentNode;
        this._component = component;
        this._key = null;
        this._attrs = null;
        this._instance = null;
        this._children = null;
        this._ns = null;
    }

    getDomNode() {
        return this._instance.getDomNode();
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
        if(!this._ns && parentNode && parentNode._ns) {
            this._ns = parentNode._ns;
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
        this._instance.getRootNode().mount();
        this._instance.mount();
    }

    unmount() {
        if(this._instance) {
            this._instance.getRootNode().unmount();
            this._instance.unmount();
            this._instance = null;
        }
    }

    patch(node, parentNode) {
        if(this === node) {
            return;
        }

        if(!node._ns && parentNode && parentNode._ns) {
            node._ns = parentNode._ns;
        }

        const instance = this._getInstance();

        if(this.type === node.type) {
            if(this._component === node._component) {
                instance.patch(node._attrs, node._children, parentNode);
                node._instance = instance;
            }
            else {
                instance.unmount();
                instance.getRootNode().patch(node._getInstance().getRootNode(), parentNode);
            }
        }
        else {
            instance.unmount();
            instance.getRootNode().patch(node, parentNode);
        }
    }

    _getInstance() {
        return this._instance || (this._instance = new this._component(this._attrs, this._children));
    }
}

export default ComponentNode;
