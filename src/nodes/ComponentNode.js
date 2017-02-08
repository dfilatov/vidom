import patchOps from '../client/patchOps';
import emptyObj from '../utils/emptyObj';
import checkReuse from './utils/checkReuse';
import merge from '../utils/merge';
import restrictObjProp from '../utils/restrictObjProp';
import { NODE_TYPE_COMPONENT } from './utils/nodeTypes';
import { setKey, setRef } from './utils/setters';
import { IS_DEBUG } from '../utils/debug';
import Input from '../components/Input';
import Radio from '../components/Radio';
import CheckBox from '../components/CheckBox';
import File from '../components/File';

const ATTRS_SET = 4,
    CHILDREN_SET = 8;

export default function ComponentNode(component) {
    if(IS_DEBUG) {
        restrictObjProp(this, 'type');
        restrictObjProp(this, 'key');
        restrictObjProp(this, 'attrs');
        restrictObjProp(this, 'children');

        this.__isFrozen = false;
    }

    this.type = NODE_TYPE_COMPONENT;
    this.key = null;
    this.attrs = null;
    this.children = null;

    if(IS_DEBUG) {
        this.__isFrozen = true;
        this._sets = 0;
    }

    this._component = component;
    this._instance = null;
    this._ctx = emptyObj;
    this._ref = null;
}

ComponentNode.prototype = {
    getDomNode() {
        return this._instance && this._instance.getDomNode();
    },

    setKey,

    setRef,

    setAttrs(attrs) {
        if(IS_DEBUG) {
            if(this._sets & ATTRS_SET) {
                console.warn('Attrs are already set and shouldn\'t be set again.');
            }

            this.__isFrozen = false;
        }

        this.attrs = this.attrs? merge(this.attrs, attrs) : attrs;

        if(IS_DEBUG) {
            Object.freeze(this.attrs);
            this._sets |= ATTRS_SET;
            this.__isFrozen = true;
        }

        if(this._component === Input) {
            switch(this.attrs.type) {
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

    setChildren(children) {
        if(IS_DEBUG) {
            if(this._sets & CHILDREN_SET) {
                console.warn('Children are already set and shouldn\'t be set again.');
            }

            this.__isFrozen = false;
        }

        this.children = children;

        if(IS_DEBUG) {
            this._sets |= CHILDREN_SET;
            this.__isFrozen = true;
        }

        return this;
    },

    setCtx(ctx) {
        this._ctx = ctx;
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
        this._ref && this._ref(this._instance.onRefRequest());
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

        if(IS_DEBUG) {
            res.__isFrozen = false;
        }

        res.key = this.key;
        res.attrs = this.attrs;
        res.children = this.children;

        if(IS_DEBUG) {
            res.__isFrozen = true;
        }

        res._ctx = this._ctx;
        res._ref = this._ref;

        return res;
    },

    patch(node) {
        const instance = this._getInstance();

        if(this === node) {
            instance.patch(node.attrs, node.children, node._ctx);
        }
        else if(this.type === node.type && this._component === node._component) {
            instance.patch(node.attrs, node.children, node._ctx);
            node._instance = instance;
            this._patchRef(node);
        }
        else {
            patchOps.replace(this, node);
            this._instance = null;
        }
    },

    _patchRef(node) {
        if(this._ref) {
            if(this._ref !== node._ref) {
                this._ref(null);

                if(node._ref) {
                    node._ref(node._instance);
                }
            }
        }
        else if(node._ref) {
            node._ref(node._instance);
        }
    },

    _getInstance() {
        return this._instance || (this._instance = new this._component(this.attrs, this.children, this._ctx));
    }
};
