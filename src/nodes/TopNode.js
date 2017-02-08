import { NODE_TYPE_TOP } from './utils/nodeTypes';

export default function TopNode(childNode) {
    this.type = NODE_TYPE_TOP;
    this._childNode = childNode;
    this._ns = null;
}

TopNode.prototype = {
    getDomNode() {
        return this._childNode.getDomNode();
    },

    setNs(ns) {
        if(ns) {
            this._ns = ns;
        }

        return this;
    },

    setCtx(ctx) {
        if(ctx) {
            this._childNode.setCtx(ctx);
        }

        return this;
    },

    renderToDom() {
        return this._childNode.renderToDom(this._ns);
    },

    adoptDom(domNode) {
        this._childNode.adoptDom(domNode, 0);
    },

    patch(node) {
        this._childNode.patch(node._childNode);
    },

    mount() {
        this._childNode.mount();
    },

    unmount() {
        this._childNode.unmount();
    }
};
