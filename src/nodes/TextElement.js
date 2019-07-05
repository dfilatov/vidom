import patchOps from '../client/patchOps';
import createElement from '../client/utils/createElement';
import checkReuse from './utils/checkReuse';
import restrictObjProp from '../utils/restrictObjProp';
import noOp from '../utils/noOp';
import escapeHtml from '../utils/escapeHtml';
import { IS_DEBUG } from '../utils/debug';
import { ELEMENT_TYPE_TEXT } from './utils/elementTypes';

export default function TextElement(key, children) {
    if(IS_DEBUG) {
        restrictObjProp(this, 'type');
        restrictObjProp(this, 'key');
        restrictObjProp(this, 'children');

        this.__isFrozen = false;
    }

    this.type = ELEMENT_TYPE_TEXT;
    this.key = key == null? null : key;
    this.children = processChildren(children);

    if(IS_DEBUG) {
        this.__isFrozen = true;
    }

    this._domNode = null;
}

TextElement.prototype = {
    getDomNode() {
        return this._domNode;
    },

    setCtx() {
        return this;
    },

    renderToDom() {
        if(IS_DEBUG) {
            checkReuse(this, 'text');
        }

        const domFragment = document.createDocumentFragment(),
            domNode = [createElement('!', null), createElement('!', null)],
            { children } = this;

        domFragment.appendChild(domNode[0]);

        if(children !== null) {
            domFragment.appendChild(document.createTextNode(children));
        }

        domFragment.appendChild(domNode[1]);

        this._domNode = domNode;

        return domFragment;
    },

    renderToString() {
        return '<!---->' + (this.children? escapeHtml(this.children) : '') + '<!---->';
    },

    adoptDom(domNodes, domIdx) {
        if(IS_DEBUG) {
            checkReuse(this, 'text');
        }

        const domNode = [domNodes[domIdx++]];

        if(this.children) {
            domIdx++;
        }

        domNode.push(domNodes[domIdx++]);

        this._domNode = domNode;

        return domIdx;
    },

    mount : noOp,

    unmount() {
        this._domNode = null;
    },

    clone(children) {
        const res = new TextElement(this.key);

        if(IS_DEBUG) {
            res.__isFrozen = false;
        }

        res.children = children == null? this.children : processChildren(children);

        if(IS_DEBUG) {
            res.__isFrozen = true;
        }

        return res;
    },

    patch(element) {
        if(this !== element) {
            if(this.type === element.type) {
                element._domNode = this._domNode;
                this._patchChildren(element);
            }
            else {
                patchOps.replace(this, element);
            }
        }
    },

    _patchChildren(element) {
        const childrenA = this.children,
            childrenB = element.children;

        if(childrenA !== childrenB) {
            if(childrenB) {
                patchOps.updateText(this, childrenB, false);
            }
            else if(childrenA) {
                patchOps.removeText(this);
            }
        }
    }
};

function processChildren(children) {
    if(children == null) {
        return null;
    }

    switch(typeof children) {
        case 'string':
            return children;

        case 'boolean':
            return null;

        default:
            return '' + children;
    }
}

