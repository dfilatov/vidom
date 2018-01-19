import patchOps from '../client/patchOps';
import createElement from '../client/utils/createElement';
import checkReuse from './utils/checkReuse';
import checkChildren from './utils/checkChildren';
import patchChildren from './utils/patchChildren';
import emptyObj from '../utils/emptyObj';
import restrictObjProp from '../utils/restrictObjProp';
import { IS_DEBUG } from '../utils/debug';
import { ELEMENT_TYPE_FRAGMENT } from './utils/elementTypes';
import normalizeNode from './utils/normalizeNode';

export default function FragmentElement(key, children) {
    if(IS_DEBUG) {
        restrictObjProp(this, 'type');
        restrictObjProp(this, 'key');
        restrictObjProp(this, 'children');

        this.__isFrozen = false;
    }

    this.type = ELEMENT_TYPE_FRAGMENT;
    this.key = key == null? null : key;
    this.children = processChildren(children);

    if(IS_DEBUG) {
        if(Array.isArray(this.children)) {
            Object.freeze(this.children);
        }
        this.__isFrozen = true;
    }

    this._domNode = null;
    this._ctx = emptyObj;
}

FragmentElement.prototype = {
    getDomNode() {
        return this._domNode;
    },

    setCtx(ctx) {
        if(ctx !== emptyObj) {
            this._ctx = ctx;

            const { children } = this;

            if(children !== null) {
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
            domNode = [createElement('!', null), createElement('!', null)],
            domFragment = document.createDocumentFragment();

        domFragment.appendChild(domNode[0]);

        if(children !== null) {
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

        if(children !== null) {
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

        if(children !== null) {
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

        if(children !== null) {
            let i = 0;
            const len = children.length;

            while(i < len) {
                children[i++].mount();
            }
        }
    },

    unmount() {
        const { children } = this;

        if(children !== null) {
            const len = children.length;
            let i = 0;

            while(i < len) {
                children[i++].unmount();
            }
        }
    },

    clone(children) {
        const res = new FragmentElement(this.key);

        if(IS_DEBUG) {
            res.__isFrozen = false;
        }

        res.children = children == null? this.children : processChildren(children);

        if(IS_DEBUG) {
            res.__isFrozen = true;
        }

        res._ctx = this._ctx;

        return res;
    },

    patch(element) {
        if(this === element) {
            this._patchChildren(element);
        }
        else if(this.type === element.type) {
            element._domNode = this._domNode;
            this._patchChildren(element);
        }
        else {
            patchOps.replace(this, element);
        }
    },

    _patchChildren(element) {
        const childrenA = this.children,
            childrenB = element.children;

        if(childrenA === null && childrenB === null) {
            return;
        }

        if(childrenB === null || childrenB.length === 0) {
            if(childrenA !== null && childrenA.length > 0) {
                patchOps.removeChildren(this);
            }

            return;
        }

        if(childrenA === null || childrenA.length === 0) {
            const childrenBLen = childrenB.length;
            let iB = 0;

            while(iB < childrenBLen) {
                patchOps.appendChild(element, childrenB[iB++]);
            }

            return;
        }

        patchChildren(this, element);
    }
};

function processChildren(children) {
    const normalizedChildren = normalizeNode(children);

    if(IS_DEBUG) {
        if(typeof normalizedChildren === 'string') {
            throw TypeError('vidom: Unexpected type of child. Only an element is expected to be here.');
        }
    }

    const res = normalizedChildren !== null && !Array.isArray(normalizedChildren)?
        [normalizedChildren] :
        normalizedChildren;

    if(IS_DEBUG) {
        if(Array.isArray(res)) {
            checkChildren(res);
        }
    }

    return res;
}

