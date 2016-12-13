import patchOps from '../client/patchOps';
import createElement from '../client/utils/createElement';
import checkReuse from './utils/checkReuse';
import { IS_DEBUG } from '../utils/debug';
import {
    NODE_TYPE_TEXT,
    NODE_TYPE_COMPONENT,
    NODE_TYPE_FUNCTION_COMPONENT
} from './utils/nodeTypes';

export default function TextNode() {
    this.type = NODE_TYPE_TEXT;
    this._domNode = null;
    this._key = null;
    this._children = null;
}

TextNode.prototype = {
    getDomNode() {
        return this._domNode;
    },

    key(key) {
        this._key = key;
        return this;
    },

    children(children) {
        this._children = processChildren(children);
        return this;
    },

    ctx() {
        return this;
    },

    renderToDom() {
        if(IS_DEBUG) {
            checkReuse(this, 'text');
        }

        const domFragment = document.createDocumentFragment(),
            domNode = [createElement('!'), createElement('!')],
            children = this._children;

        domFragment.appendChild(domNode[0]);

        if(children) {
            domFragment.appendChild(document.createTextNode(children));
        }

        domFragment.appendChild(domNode[1]);

        this._domNode = domNode;

        return domFragment;
    },

    renderToString() {
        return '<!---->' + (this._children || '') + '<!---->';
    },

    adoptDom(domNodes, domIdx) {
        if(IS_DEBUG) {
            checkReuse(this, 'text');
        }

        const domNode = [domNodes[domIdx++]];

        if(this._children) {
            domIdx++;
        }

        domNode.push(domNodes[domIdx++]);

        this._domNode = domNode;

        return domIdx;
    },

    mount() {},

    unmount() {},

    clone() {
        const res = new TextNode();

        res._key = this._key;
        res._children = this._children;

        return res;
    },

    patch(node) {
        if(this === node) {
            return;
        }

        switch(node.type) {
            case NODE_TYPE_TEXT:
                node._domNode = this._domNode;
                this._patchChildren(node);
                break;

            case NODE_TYPE_COMPONENT:
                const instance = node._getInstance();

                this.patch(instance.getRootNode());
                instance.mount();
                break;

            case NODE_TYPE_FUNCTION_COMPONENT:
                this.patch(node._getRootNode());
                break;

            default:
                patchOps.replace(this, node);
        }
    },

    _patchChildren(node) {
        const childrenA = this._children,
            childrenB = node._children;

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
    return children == null || typeof children === 'string'?
        children :
        children.toString();
}

