import noOp from './utils/noOp';
import rafBatch from './client/rafBatch';
import createNode from './createNode';
import merge from './utils/merge';
import console from './utils/console';
import emptyObj from './utils/emptyObj';
import { IS_DEBUG } from './utils/debug';
import globalHook from './globalHook';

function mountComponent() {
    this.__isMounted = true;
    this.onMount(this.__attrs, this.__children);
}

function unmountComponent() {
    this.__isMounted = false;
    this.onUnmount();
}

function patchComponent(attrs, children, ctx) {
    attrs = this.__buildAttrs(attrs);

    let prevRootNode = this.__rootNode,
        prevAttrs = this.__attrs,
        prevChildren = this.__children;

    if(prevAttrs !== attrs || prevChildren !== children) {
        this.__attrs = attrs;
        if(this.isMounted()) {
            const isUpdating = this.__isUpdating;
            this.__isUpdating = true;
            this.onAttrsReceive(attrs, prevAttrs, children, prevChildren);
            this.__isUpdating = isUpdating;
        }
    }

    this.__children = children;
    this.__ctx = ctx;

    if(this.__isUpdating) {
        return;
    }

    const shouldUpdate = this.shouldUpdate(attrs, prevAttrs, children, prevChildren);

    if(IS_DEBUG) {
        const shouldUpdateResType = typeof shouldUpdate;
        if(shouldUpdateResType !== 'boolean') {
            console.warn(`Component#shouldUpdate() should return boolean instead of ${shouldUpdateResType}`);
        }
    }

    if(shouldUpdate) {
        this.__rootNode = this.render();
        prevRootNode.patch(this.__rootNode);
        this.isMounted() && this.onUpdate(attrs, prevAttrs, children, prevChildren);
    }
}

function shouldComponentUpdate() {
    return true;
}

function renderComponentToDom(parentNs) {
    return this.__rootNode.renderToDom(parentNs);
}

function renderComponentToString() {
    return this.__rootNode.renderToString();
}

function adoptComponentDom(domNode, domIdx) {
    return this.__rootNode.adoptDom(domNode, domIdx);
}

function getComponentDomNode() {
    return this.__rootNode.getDomNode();
}

function getComponentAttrs() {
    return this.__attrs;
}

function getComponentChildren() {
    return this.__children;
}

function requestChildContext() {
    return emptyObj;
}

function requestInitialComponentState() {
    return emptyObj;
}

function setComponentState(state) {
    this.__prevState = this.__state;
    this.__state = merge(this.__state, state);

    this.update(updateComponentPrevState);
}

function updateComponentPrevState() {
    this.__prevState = this.__state;
}

function getComponentState() {
    return this.__state;
}

function getComponentPrevState() {
    return this.__prevState;
}

function renderComponent() {
    const rootNode = this.onRender(this.__attrs, this.__children) || createNode('!');

    if(IS_DEBUG) {
        if(typeof rootNode !== 'object' || Array.isArray(rootNode)) {
            console.error('Component#onRender must return a single node object on the top level');
        }
    }

    const childCtx = this.onChildContextRequest(this.__attrs);

    rootNode.ctx(childCtx === emptyObj?
        this.__ctx :
        this.__ctx === emptyObj?
            childCtx :
            merge(this.__ctx, childCtx));

    return rootNode;
}

function updateComponent(cb) {
    if(this.__isUpdating) {
        cb && rafBatch(() => cb.call(this));
    }
    else {
        this.__isUpdating = true;
        rafBatch(() => {
            if(this.isMounted()) {
                this.__isUpdating = false;
                const prevRootNode = this.__rootNode;

                this.patch(this.__attrs, this.__children, this.__ctx);
                cb && cb.call(this);
                if(IS_DEBUG) {
                    globalHook.emit('replace', prevRootNode, this.__rootNode);
                }
            }
        });
    }
}

function getComponentRootNode() {
    return this.__rootNode;
}

function isComponentMounted() {
    return this.__isMounted;
}

function getComponentContext() {
    return this.__ctx;
}

function getComponentRef() {
    return this.onRefRequest();
}

function onComponentRefRequest() {
    return this;
}

function getComponentDefaultAttrs() {
    return emptyObj;
}

function buildComponentAttrs(attrs) {
    if(this.__attrs && attrs === this.__attrs) {
        return attrs;
    }

    const cons = this.constructor,
        defaultAttrs = cons.__defaultAttrs || (cons.__defaultAttrs = cons.getDefaultAttrs());

    return attrs?
        defaultAttrs === emptyObj?
            attrs :
            merge(defaultAttrs, attrs) :
        defaultAttrs;
}

function createComponent(props, staticProps) {
    const res = function(attrs, children, ctx) {
            this.__attrs = this.__buildAttrs(attrs);
            this.__children = children;
            this.__ctx = ctx;
            this.__isMounted = false;
            this.__isUpdating = false;
            this.__state = this.onInitialStateRequest(this.__attrs, children);
            this.__prevState = this.__state;
            this.onInit(this.__attrs, children);
            this.__rootNode = this.render();
        },
        ptp = {
            constructor : res,
            onInitialStateRequest : requestInitialComponentState,
            onInit : noOp,
            mount : mountComponent,
            unmount : unmountComponent,
            onMount : noOp,
            onUnmount : noOp,
            onAttrsReceive : noOp,
            shouldUpdate : shouldComponentUpdate,
            onUpdate : noOp,
            isMounted : isComponentMounted,
            getState : getComponentState,
            getPrevState : getComponentPrevState,
            setState : setComponentState,
            renderToDom : renderComponentToDom,
            renderToString : renderComponentToString,
            adoptDom : adoptComponentDom,
            getDomNode : getComponentDomNode,
            getRootNode : getComponentRootNode,
            render : renderComponent,
            onRender : noOp,
            update : updateComponent,
            patch : patchComponent,
            getAttrs : getComponentAttrs,
            getChildren : getComponentChildren,
            onChildContextRequest : requestChildContext,
            getContext : getComponentContext,
            getRef : getComponentRef,
            onRefRequest : onComponentRefRequest,
            __buildAttrs : buildComponentAttrs
        };

    for(let i in props) {
        ptp[i] = props[i];
    }

    res.prototype = ptp;

    res.getDefaultAttrs = getComponentDefaultAttrs;

    for(let i in staticProps) {
        res[i] = staticProps[i];
    }

    res['__vidom__component__'] = true;

    return res;
}

export default createComponent;
