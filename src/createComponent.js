import noOp from './utils/noOp';
import rafBatch from './client/rafBatch';
import merge from './utils/merge';
import console from './utils/console';
import emptyObj from './utils/emptyObj';
import restrictObjProp from './utils/restrictObjProp';
import { IS_DEBUG } from './utils/debug';
import nodeToElement from './nodes/utils/nodeToElement';
import globalHook from './globalHook';

function initComponent() {
    this.onInit();

    if(IS_DEBUG) {
        this.__isFrozen = false;
    }

    this.state = this.__nextState;

    if(IS_DEBUG) {
        this.__isFrozen = true;
    }

    this.__isInited = true;
}

function mountComponent() {
    this.__isMounted = true;
    this.getRootElement().mount();
    this.onMount();
}

function unmountComponent() {
    this.__isMounted = false;
    this.getRootElement().unmount();
    this.onUnmount();
}

function patchComponent(nextAttrs, nextChildren, nextContext, callReceivers) {
    if(!this.isMounted()) {
        return;
    }

    if(callReceivers) {
        const isUpdating = this.__isUpdating;

        this.__isUpdating = true;

        nextAttrs = this.__buildAttrs(nextAttrs);

        this.onAttrsReceive(nextAttrs);
        this.onChildrenReceive(nextChildren);
        this.onContextReceive(nextContext);

        this.__isUpdating = isUpdating;
    }

    if(this.__isUpdating) {
        return;
    }

    const shouldUpdate = this.shouldUpdate(
        nextAttrs,
        nextChildren,
        this.__nextState,
        nextContext);

    if(IS_DEBUG) {
        const shouldUpdateResType = typeof shouldUpdate;

        if(shouldUpdateResType !== 'boolean') {
            const name = getComponentName(this);

            console.warn(`${name}#shouldUpdate() should return boolean instead of ${shouldUpdateResType}`);
        }
    }

    const prevAttrs = this.attrs,
        prevChildren = this.children,
        prevState = this.state,
        prevContext = this.context;

    if(IS_DEBUG) {
        this.__isFrozen = false;
    }

    if(callReceivers) {
        this.attrs = nextAttrs;
        this.children = nextChildren;
        this.context = nextContext;

        if(IS_DEBUG) {
            Object.freeze(this.context);
        }
    }

    this.state = this.__nextState;

    if(IS_DEBUG) {
        Object.freeze(this.state);
        this.__isFrozen = true;
    }

    if(shouldUpdate) {
        const prevRootElem = this.getRootElement();

        this.__rootElement = this.render();
        prevRootElem.patch(this.__rootElement);
        this.onUpdate(
            prevAttrs,
            prevChildren,
            prevState,
            prevContext);
    }
}

function shouldComponentUpdate() {
    return true;
}

function onComponentRender() {
    return null;
}

function renderComponentToDom(parentNs) {
    return this.getRootElement().renderToDom(parentNs);
}

function renderComponentToString() {
    return this.getRootElement().renderToString();
}

function adoptComponentDom(domNode, domIdx) {
    return this.getRootElement().adoptDom(domNode, domIdx);
}

function getComponentDomNode() {
    return this.getRootElement().getDomNode();
}

function requestChildContext() {
    return emptyObj;
}

function setComponentState(state) {
    if(IS_DEBUG) {
        if(this.__disallowSetState) {
            const name = getComponentName(this);

            console.warn(`${name}#setState() should not be called during rendering`);
        }
    }

    this.__nextState = merge(this.__nextState, state);

    if(this.__isInited) {
        this.update();
    }
}

function renderComponent() {
    if(IS_DEBUG) {
        this.__disallowSetState = true;
    }

    const rootElem = nodeToElement(this.onRender());

    if(IS_DEBUG) {
        this.__disallowSetState = false;
    }

    const childCtx = this.onChildContextRequest(),
        rootElemCtx = childCtx === emptyObj?
            this.context :
            this.context === emptyObj?
                childCtx :
                merge(this.context, childCtx);

    if(IS_DEBUG) {
        Object.freeze(rootElemCtx);
    }

    rootElem.setCtx(rootElemCtx);

    return rootElem;
}

function updateComponent() {
    if(this.__isUpdating || !this.isMounted()) {
        return;
    }

    this.__isUpdating = true;
    rafBatch(() => {
        if(this.isMounted()) {
            this.__isUpdating = false;

            if(IS_DEBUG) {
                const prevRootElem = this.__rootElement;

                this.patch(this.attrs, this.children, this.context, false);

                globalHook.emit('replace', prevRootElem, this.__rootElement);
            }
            else {
                this.patch(this.attrs, this.children, this.context, false);
            }
        }
    });
}

function getComponentRootElem() {
    return this.__rootElement === null?
        this.__rootElement = this.render() :
        this.__rootElement;
}

function isComponentMounted() {
    return this.__isMounted;
}

function onComponentRefRequest() {
    return this;
}

function buildComponentAttrs(attrs) {
    if(attrs === this.attrs) {
        return attrs;
    }

    const { defaultAttrs } = this.constructor,
        hasDefaultAttrs = defaultAttrs != null,
        res = attrs === emptyObj?
            hasDefaultAttrs? defaultAttrs : attrs :
            hasDefaultAttrs? merge(defaultAttrs, attrs) : attrs;

    if(IS_DEBUG) {
        Object.freeze(res);
    }

    return res;
}

function getComponentName(component) {
    return component.constructor.name || 'Component';
}

function createComponent(props, staticProps) {
    const res = function(attrs, children, ctx) {
            if(IS_DEBUG) {
                restrictObjProp(this, 'attrs');
                restrictObjProp(this, 'children');
                restrictObjProp(this, 'state');
                restrictObjProp(this, 'context');

                this.__isFrozen = false;
                this.__disallowSetState = false;
            }

            this.attrs = this.__buildAttrs(attrs);
            this.children = children;
            this.state = emptyObj;
            this.context = ctx;

            if(IS_DEBUG) {
                this.__isFrozen = true;
            }

            this.__isInited = false;
            this.__isMounted = false;
            this.__isUpdating = false;
            this.__rootElement = null;
            this.__nextState = this.state;
        },
        ptp = {
            constructor : res,
            init : initComponent,
            onInit : noOp,
            mount : mountComponent,
            unmount : unmountComponent,
            onMount : noOp,
            onUnmount : noOp,
            onAttrsReceive : noOp,
            onChildrenReceive : noOp,
            onContextReceive : noOp,
            shouldUpdate : shouldComponentUpdate,
            onRender : onComponentRender,
            onUpdate : noOp,
            isMounted : isComponentMounted,
            setState : setComponentState,
            renderToDom : renderComponentToDom,
            renderToString : renderComponentToString,
            adoptDom : adoptComponentDom,
            getDomNode : getComponentDomNode,
            getRootElement : getComponentRootElem,
            render : renderComponent,
            update : updateComponent,
            patch : patchComponent,
            onChildContextRequest : requestChildContext,
            onRefRequest : onComponentRefRequest,
            __buildAttrs : buildComponentAttrs
        };

    for(const i in props) {
        ptp[i] = props[i];
    }

    res.prototype = ptp;

    for(const i in staticProps) {
        res[i] = staticProps[i];
    }

    res['__vidom__component__'] = true;

    return res;
}

export default createComponent;
