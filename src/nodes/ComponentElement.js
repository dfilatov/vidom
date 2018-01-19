import patchOps from '../client/patchOps';
import emptyObj from '../utils/emptyObj';
import checkReuse from './utils/checkReuse';
import merge from '../utils/merge';
import restrictObjProp from '../utils/restrictObjProp';
import { ELEMENT_TYPE_COMPONENT } from './utils/elementTypes';
import { IS_DEBUG } from '../utils/debug';
import Input from '../components/Input';
import Radio from '../components/Radio';
import CheckBox from '../components/CheckBox';
import File from '../components/File';

export default function ComponentElement(component, key, attrs, children, ref) {
    if(IS_DEBUG) {
        restrictObjProp(this, 'type');
        restrictObjProp(this, 'key');
        restrictObjProp(this, 'attrs');
        restrictObjProp(this, 'children');

        this.__isFrozen = false;
    }

    this.type = ELEMENT_TYPE_COMPONENT;
    this.key = key == null? null : key;
    this.attrs = attrs || emptyObj;
    this.children = children;

    if(component === Input) {
        switch(this.attrs.type) {
            case 'radio':
                this.component = Radio;
                break;

            case 'checkbox':
                this.component = CheckBox;
                break;

            case 'file':
                this.component = File;
                break;

            default:
                this.component = component;
        }
    }
    else {
        this.component = component;
    }

    if(IS_DEBUG) {
        Object.freeze(this.attrs);

        this.__isFrozen = true;
    }

    this._instance = null;
    this._ctx = emptyObj;
    this._ref = ref == null? null : ref;
}

ComponentElement.prototype = {
    getDomNode() {
        return this._instance === null?
            null :
            this._instance.getDomNode();
    },

    setCtx(ctx) {
        this._ctx = ctx;
        return this;
    },

    renderToDom(parentNs) {
        if(IS_DEBUG) {
            checkReuse(this, this.component.name || 'Anonymous');
        }

        return this._getInstance().renderToDom(parentNs);
    },

    renderToString() {
        return this._getInstance().renderToString();
    },

    adoptDom(domNode, domIdx) {
        if(IS_DEBUG) {
            checkReuse(this, this.component.name || 'Anonymous');
        }

        return this._getInstance().adoptDom(domNode, domIdx);
    },

    mount() {
        this._instance.mount();

        if(this._ref !== null) {
            this._ref(this._instance.onRefRequest());
        }
    },

    unmount() {
        if(this._instance !== null) {
            this._instance.unmount();
            this._instance = null;
        }

        if(this._ref !== null) {
            this._ref(null);
        }
    },

    clone(attrs, children) {
        const res = new ComponentElement(this.component, this.key);

        if(IS_DEBUG) {
            res.__isFrozen = false;
        }

        res.attrs = attrs == null? this.attrs : merge(this.attrs, attrs);
        res.children = children == null? this.children : children;

        if(IS_DEBUG) {
            res.__isFrozen = true;
        }

        res._ctx = this._ctx;
        res._ref = this._ref;

        return res;
    },

    patch(element) {
        const instance = this._getInstance();

        if(this === element) {
            instance.patch(element.attrs, element.children, element._ctx, true);
        }
        else if(this.type === element.type && this.component === element.component) {
            instance.patch(element.attrs, element.children, element._ctx, true);
            element._instance = instance;
            this._patchRef(element);
        }
        else {
            patchOps.replace(this, element);
            this._instance = null;
        }
    },

    _patchRef(element) {
        if(this._ref !== null) {
            if(this._ref !== element._ref) {
                this._ref(null);

                if(element._ref !== null) {
                    element._ref(element._instance.onRefRequest());
                }
            }
        }
        else if(element._ref !== null) {
            element._ref(element._instance.onRefRequest());
        }
    },

    _getInstance() {
        if(this._instance === null) {
            this._instance = new this.component(this.attrs, this.children, this._ctx);
            this._instance.init();
        }

        return this._instance;
    }
};
