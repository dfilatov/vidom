import patchOps from '../client/patchOps';
import normalizeNs from './utils/normalizeNs';
import checkChildren from './utils/checkChildren';
import patchChildren from './utils/patchChildren';
import console from '../utils/console';
import emptyObj from '../utils/emptyObj';
import {
    NODE_TYPE_FRAGMENT,
    NODE_TYPE_COMPONENT,
    NODE_TYPE_FUNCTION_COMPONENT
} from './utils/nodeTypes';

const doc = global.document;
let boundaryDomNode;

export default function FragmentNode() {
    this.type = NODE_TYPE_FRAGMENT;
    this._boundaryDomNode = null;
    this._key = null;
    this._children = null;
    this._ctx = emptyObj;
}

FragmentNode.prototype = {
    getDomNode() {
        const domNode = [this._boundaryDomNode],
            children = this._children;

        if(children) {
            let i = children.length - 1,
                childDomNode;

            while(i >= 0) {
                if(childDomNode = children[i--].getDomNode()) {
                    domNode.unshift(childDomNode);
                }
            }
        }

        return domNode;
    },

    key(key) {
        this._key = key;
        return this;
    },

    children(children) {
        if(process.env.NODE_ENV !== 'production') {
            if(this._children !== null) {
                console.warn('You\'re trying to set children to fragment more than once.');
            }
        }

        this._children = processChildren(children);
        return this;
    },

    ctx(ctx) {
        if(ctx !== emptyObj) {
            this._ctx = ctx;

            const children = this._children;

            if(children) {
                const len = children.length;
                let i = 0;

                while(i < len) {
                    children[i++].ctx(ctx);
                }
            }
        }

        return this;
    },

    renderToDom(parent) {
        normalizeNs(this, parent);

        const children = this._children,
            domNode = [this._boundaryDomNode = createBoundaryDomNode()];

        if(children) {
            let i = children.length - 1;

            while(i >= 0) {
                domNode.unshift(children[i--].renderToDom(this));
            }
        }

        return domNode;
    },

    renderToString() {
        const children = this._children;
        let res = '<!---->';

        if(children) {
            let i = children.length - 1;

            while(i >= 0) {
                res = children[i--].renderToString() + res;
            }
        }

        return res;
    },

    adoptDom(domNodes, domIdx, parentNode) {
        normalizeNs(this, parentNode);

        const children = this._children,
            len = children.length;
        let i = 0;

        while(i < len) {
            domIdx = children[i++].adoptDom(domNodes, domIdx, parentNode);
        }

        this._boundaryDomNode = domNodes[domIdx];

        return domIdx + 1;
    },

    mount() {
        const children = this._children;

        if(children) {
            let i = 0;
            const len = children.length;

            while(i < len) {
                children[i++].mount();
            }
        }
    },

    unmount() {
        const children = this._children;

        if(children) {
            const len = children.length;
            let i = 0;

            while(i < len) {
                children[i++].unmount();
            }
        }
    },

    patch(node, parentNode) {
        if(this === node) {
            return;
        }

        normalizeNs(node, parentNode);

        switch(node.type) {
            case NODE_TYPE_FRAGMENT:
                node._boundaryDomNode = this._boundaryDomNode;
                this._patchChildren(node);
                break;

            case NODE_TYPE_COMPONENT:
                const instance = node._getInstance();

                this.patch(instance.getRootNode(), parentNode);
                instance.mount();
                break;

            case NODE_TYPE_FUNCTION_COMPONENT:
                this.patch(node._getRootNode(), parentNode);
                break;

            default:
                patchOps.replace(parentNode, this, node);
        }
    },

    _patchChildren(node) {
        const childrenA = this._children,
            childrenB = node._children;

        if(childrenA === childrenB) {
            return;
        }

        if(!childrenB || !childrenB.length) {
            if(childrenA && childrenA.length) {
                patchOps.removeChildren(this);
            }

            return;
        }

        if(!childrenA || !childrenA.length) {
            const childrenBLen = childrenB.length;
            let iB = 0;

            while(iB < childrenBLen) {
                patchOps.appendChild(node, childrenB[iB++]);
            }

            return;
        }

        patchChildren(this, node);
    }
};

function processChildren(children) {
    if(children == null) {
        return null;
    }

    const res = Array.isArray(children)? children : [children];

    if(process.env.NODE_ENV !== 'production') {
        checkChildren(res);
    }

    return res;
}

function createBoundaryDomNode() {
    return boundaryDomNode?
        boundaryDomNode.cloneNode() :
        boundaryDomNode = doc.createComment('');
}
