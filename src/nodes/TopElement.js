import { ELEMENT_TYPE_TOP } from './utils/elementTypes';

export default function TopElement(childElement) {
    this.type = ELEMENT_TYPE_TOP;
    this._childElement = childElement;
    this._ns = null;
}

TopElement.prototype = {
    getDomNode() {
        return this._childElement.getDomNode();
    },

    setNs(ns) {
        if(ns) {
            this._ns = ns;
        }

        return this;
    },

    setCtx(ctx) {
        if(ctx) {
            this._childElement.setCtx(ctx);
        }

        return this;
    },

    renderToDom() {
        return this._childElement.renderToDom(this._ns);
    },

    adoptDom(domNode) {
        this._childElement.adoptDom(domNode, 0);
    },

    patch(element) {
        this._childElement.patch(element._childElement);
    },

    mount() {
        this._childElement.mount();
    },

    unmount() {
        this._childElement.unmount();
    }
};
