import { ELEMENT_TYPE_TOP } from './utils/elementTypes';

export default function TopElement(childElement, ns) {
    this.type = ELEMENT_TYPE_TOP;
    this._childElement = childElement;
    this._ns = ns;
}

TopElement.prototype = {
    getDomNode() {
        return this._childElement.getDomNode();
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
