import { NODE_TYPE_TOP } from './utils/nodeTypes';

export default function TopNode(childNode, ns) {
    this.type = NODE_TYPE_TOP;
    this._childNode = childNode;
    this._ns = ns;
}

TopNode.prototype = {
    getDomNode() {
        return this._childNode.getDomNode();
    },

    renderToDom() {
        return this._childNode.renderToDom(this);
    },

    adoptDom(domNode) {
        this._childNode.adoptDom(domNode, 0, this);
    },

    patch(childNode) {
        this._childNode.patch(childNode, this);
        this._childNode = childNode;
    },

    mount() {
        this._childNode.mount();
    },

    unmount() {
        this._childNode.unmount();
    }
};
