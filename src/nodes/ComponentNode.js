import emptyObj from '../utils/emptyObj';
import checkReuse from './utils/checkReuse';
import merge from '../utils/merge';
import { NODE_TYPE_COMPONENT } from './utils/nodeTypes';
import { IS_DEBUG } from '../utils/debug';

export default function ComponentNode(component) {
    this.type = NODE_TYPE_COMPONENT;
    this._component = component;
    this._key = null;
    this._attrs = null;
    this._children = null;
    this._instance = null;
    this._ctx = emptyObj;
    this._ref = null;
}

ComponentNode.prototype = {
    getDomNode() {
        return this._instance && this._instance.getDomNode();
    },

    key(key) {
        this._key = key;
        return this;
    },

    attrs(attrs) {
        this._attrs = this._attrs? merge(this._attrs, attrs) : attrs;
        return this;
    },

    children(children) {
        this._children = children;
        return this;
    },

    ctx(ctx) {
        this._ctx = ctx;
        return this;
    },

    ref(ref) {
        this._ref = ref;
        return this;
    },

    renderToDom(parentNs) {
        if(IS_DEBUG) {
            checkReuse(this, this._component.name || 'Anonymous');
        }

        return this._getInstance().renderToDom(parentNs);
    },

    renderToString() {
        return this._getInstance().renderToString();
    },

    adoptDom(domNode, domIdx) {
        if(IS_DEBUG) {
            checkReuse(this, this._component.name || 'Anonymous');
        }

        return this._getInstance().adoptDom(domNode, domIdx);
    },

    mount() {
        this._instance.getRootNode().mount();
        this._instance.mount();
        this._ref && this._ref(this._instance);
    },

    unmount() {
        if(this._instance) {
            this._instance.getRootNode().unmount();
            this._instance.unmount();
            this._instance = null;
            this._ref && this._ref(null);
        }
    },

    clone() {
        const res = new ComponentNode(this._component);

        res._key = this._key;
        res._attrs = this._attrs;
        res._children = this._children;
        res._ctx = this._ctx;
        res._ref = this._ref;

        return res;
    },

    patch(node) {
        const instance = this._getInstance();

        if(this === node) {
            instance.patch(node._attrs, node._children, node._ctx);
        }
        else {
            if(this.type === node.type) {
                if(this._component === node._component) {
                    instance.patch(node._attrs, node._children, node._ctx);
                    node._instance = instance;
                }
                else {
                    instance.unmount();

                    const newInstance = node._getInstance();

                    instance.getRootNode().patch(newInstance.getRootNode());
                    newInstance.mount();
                }
            }
            else {
                instance.unmount();
                instance.getRootNode().patch(node);
            }

            this._instance = null;
        }
    },

    _getInstance() {
        return this._instance || (this._instance = new this._component(this._attrs, this._children, this._ctx));
    }
};
