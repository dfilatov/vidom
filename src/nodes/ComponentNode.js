import emptyObj from '../utils/emptyObj';
import checkReuse from './utils/checkReuse';
import merge from '../utils/merge';
import { NODE_TYPE_COMPONENT } from './utils/nodeTypes';
import { IS_DEBUG } from '../utils/debug';
import Input from '../components/Input';
import Radio from '../components/Radio';
import CheckBox from '../components/CheckBox';
import File from '../components/File';

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

        if(this._component === Input) {
            switch(this._attrs.type) {
                case 'radio':
                    this._component = Radio;
                    break;

                case 'checkbox':
                    this._component = CheckBox;
                    break;

                case 'file':
                    this._component = File;
                    break;
            }
        }

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

        ref.setResolver(() => {
            return this._instance.onRefRequest();
        });

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
    },

    unmount() {
        if(this._instance) {
            this._instance.getRootNode().unmount();
            this._instance.unmount();
            this._instance = null;
        }
    },

    clone() {
        const res = new ComponentNode(this._component);

        res._key = this._key;
        res._attrs = this._attrs;
        res._children = this._children;
        res._ctx = this._ctx;

        if(this._ref) {
            res.ref(this._ref);
        }

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
