import patchOps from '../client/patchOps';
import createElement from '../client/utils/createElement';
import checkReuse from './utils/checkReuse';
import restrictObjProp from '../utils/restrictObjProp';
import noOp from '../utils/noOp';
import { IS_DEBUG } from '../utils/debug';
import { NODE_TYPE_TEXT } from './utils/nodeTypes';
import { setKey } from './utils/setters';

const CHILDREN_SET = 8;

export default function TextNode() {
    if(IS_DEBUG) {
        restrictObjProp(this, 'type');
        restrictObjProp(this, 'key');
        restrictObjProp(this, 'children');

        this.__isFrozen = false;
    }

    this.type = NODE_TYPE_TEXT;
    this.key = null;
    this.children = null;

    if(IS_DEBUG) {
        this.__isFrozen = true;
    }

    this._domNode = null;
}

TextNode.prototype = {
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
            this._sets |= CHILDREN_SET;
            this.__isFrozen = true;
        }

        return this;
    },

    setCtx() {
        return this;
    },

    renderToDom() {
        if(IS_DEBUG) {
            checkReuse(this, 'text');
        }

        const domFragment = document.createDocumentFragment(),
            domNode = [createElement('!'), createElement('!')],
            { children } = this;

        domFragment.appendChild(domNode[0]);

        if(children) {
            domFragment.appendChild(document.createTextNode(children));
        }

        domFragment.appendChild(domNode[1]);

        this._domNode = domNode;

        return domFragment;
    },

    renderToString() {
        return '<!---->' + (this.children || '') + '<!---->';
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

    unmount : noOp,

    clone() {
        const res = new TextNode();

        if(IS_DEBUG) {
            res.__isFrozen = false;
        }

        res.key = this.key;
        res.children = this.children;

        if(IS_DEBUG) {
            res.__isFrozen = true;
        }

        return res;
    },

    patch(node) {
        if(this !== node) {
            if(this.type === node.type) {
                node._domNode = this._domNode;
                this._patchChildren(node);
            }
            else {
                patchOps.replace(this, node);
            }
        }
    },

    _patchChildren(node) {
        const childrenA = this.children,
            childrenB = node.children;

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

if(IS_DEBUG) {
    TextNode.prototype.setRef = function() {
        throw Error('vidom: Text nodes don\'t support refs.');
    };
}

function processChildren(children) {
    return children == null || typeof children === 'string'?
        children :
        children.toString();
}

