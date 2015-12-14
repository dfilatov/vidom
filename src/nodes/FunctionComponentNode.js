import TagNode from './TagNode';

export default class FunctionComponentNode {
    constructor(component) {
        this.type = FunctionComponentNode;
        this._component = component;
        this._key = null;
        this._attrs = null;
        this._rootNode = null;
        this._children = null;
        this._ns = null;
    }

    getDomNode() {
        return this._rootNode.getDomNode();
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

        return this._getRootNode().renderToDom(this);
    }

    renderToString(ctx) {
        return this._getRootNode().renderToString(ctx);
    }

    adoptDom(domNode, parentNode) {
        this._getRootNode().adoptDom(domNode, parentNode);
    }

    mount() {
        this._getRootNode().mount();
    }

    unmount() {
        if(this._rootNode) {
            this._rootNode.unmount();
            this._rootNode = null;
        }
    }

    patch(node, parentNode) {
        if(this === node) {
            return;
        }

        if(!node._ns && parentNode && parentNode._ns) {
            node._ns = parentNode._ns;
        }

        this._getRootNode().patch(this.type === node.type? node._getRootNode() : node, parentNode);
    }

    _getRootNode() {
        if(this._rootNode) {
            return this._rootNode;
        }

        const renderRes = this._component(this._attrs, this._children) || new TagNode('noscript');

        if(process.env.NODE_ENV !== 'production') {
            if(typeof renderRes !== 'object' || Array.isArray(renderRes)) {
                console.error('Functional component must return a single node object on the top level');
            }
        }

        return this._rootNode = renderRes;
    }
}
