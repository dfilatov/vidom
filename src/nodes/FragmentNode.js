import patchOps from '../client/patchOps';
import createElement from '../client/utils/createElement';
import checkReuse from './utils/checkReuse';
import checkChildren from './utils/checkChildren';
import patchChildren from './utils/patchChildren';
import emptyObj from '../utils/emptyObj';
import console from '../utils/console';
import restrictObjProp from '../utils/restrictObjProp';
import { IS_DEBUG } from '../utils/debug';
import { NODE_TYPE_FRAGMENT } from './utils/nodeTypes';
import { setKey } from './utils/setters';

const CHILDREN_SET = 8;

export default function FragmentNode() {
    if(IS_DEBUG) {
        restrictObjProp(this, 'type');
        restrictObjProp(this, 'key');
        restrictObjProp(this, 'children');

        this.__isFrozen = false;
    }

    this.type = NODE_TYPE_FRAGMENT;
    this.key = null;
    this.children = null;

    if(IS_DEBUG) {
        this.__isFrozen = true;
        this._sets = 0;
    }

    this._domNode = null;
    this._ctx = emptyObj;
}

FragmentNode.prototype = {
    getDomNode() {
        return this._domNode;
    },

    setKey,

    setChildren(children) {
        if(IS_DEBUG) {
            if(this._sets & CHILDREN_SET) {
                console.warn('Children are already set and shouldn\'t be set again.');
            }

            this.__isFrozen = false;
        }

        this.children = processChildren(children);

        if(IS_DEBUG) {
            if(Array.isArray(this.children)) {
                Object.freeze(this.children);
            }

            this._sets |= CHILDREN_SET;
            this.__isFrozen = true;
        }

        return this;
    },

    setCtx(ctx) {
        if(ctx !== emptyObj) {
            this._ctx = ctx;

            const { children } = this;

            if(children) {
                const len = children.length;
                let i = 0;

                while(i < len) {
                    children[i++].setCtx(ctx);
                }
            }
        }

        return this;
    },

    renderToDom(parentNs) {
        if(IS_DEBUG) {
            checkReuse(this, 'fragment');
        }

        const { children } = this,
            domNode = [createElement('!'), createElement('!')],
            domFragment = document.createDocumentFragment();

        domFragment.appendChild(domNode[0]);

        if(children) {
            const len = children.length;
            let i = 0;

            while(i < len) {
                domFragment.appendChild(children[i++].renderToDom(parentNs));
            }
        }

        domFragment.appendChild(domNode[1]);

        this._domNode = domNode;

        return domFragment;
    },

    renderToString() {
        const { children } = this;
        let res = '<!---->';

        if(children) {
            let i = children.length - 1;

            while(i >= 0) {
                res = children[i--].renderToString() + res;
            }
        }

        return '<!---->' + res;
    },

    adoptDom(domNodes, domIdx) {
        if(IS_DEBUG) {
            checkReuse(this, 'fragment');
        }

        const domNode = [domNodes[domIdx++]],
            { children } = this;

        if(children) {
            const len = children.length;
            let i = 0;

            while(i < len) {
                domIdx = children[i++].adoptDom(domNodes, domIdx);
            }
        }

        domNode.push(domNodes[domIdx]);

        this._domNode = domNode;

        return domIdx + 1;
    },

    mount() {
        const { children } = this;

        if(children) {
            let i = 0;
            const len = children.length;

            while(i < len) {
                children[i++].mount();
            }
        }
    },

    unmount() {
        const { children } = this;

        if(children) {
            const len = children.length;
            let i = 0;

            while(i < len) {
                children[i++].unmount();
            }
        }
    },

    clone() {
        const res = new FragmentNode();

        if(IS_DEBUG) {
            res.__isFrozen = false;
        }

        res.key = this.key;
        res.children = this.children;

        if(IS_DEBUG) {
            res.__isFrozen = true;
        }

        res._ctx = this._ctx;

        return res;
    },

    patch(node) {
        if(this === node) {
            this._patchChildren(node);
        }
        else if(this.type === node.type) {
            node._domNode = this._domNode;
            this._patchChildren(node);
        }
        else {
            patchOps.replace(this, node);
        }
    },

    _patchChildren(node) {
        const childrenA = this.children,
            childrenB = node.children;

        if(!childrenA && !childrenB) {
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

if(IS_DEBUG) {
    FragmentNode.prototype.setRef = function() {
        console.error('Fragment nodes don\'t support refs.');
        return this;
    };
}

function processChildren(children) {
    if(children == null) {
        return null;
    }

    const res = Array.isArray(children)? children : [children];

    if(IS_DEBUG) {
        checkChildren(res);
    }

    return res;
}
