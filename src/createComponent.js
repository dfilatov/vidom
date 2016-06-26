import noOp from './utils/noOp';
import rafBatch from './client/rafBatch';
import createNode from './createNode';
import console from './utils/console';
import emptyObj from './utils/emptyObj';
import globalHook from './globalHook';

function mountComponent() {
    this._isMounted = true;
    this.onMount(this._attrs);
}

function unmountComponent() {
    this._isMounted = false;
    this._domRefs = null;
    this.onUnmount();
}

function patchComponent(attrs, children, ctx, parentNode) {
    attrs = this._buildAttrs(attrs);

    let prevRootNode = this._rootNode,
        prevAttrs = this._attrs,
        prevChildren = this._children;

    if(prevAttrs !== attrs || prevChildren !== children) {
        this._attrs = attrs;
        if(this.isMounted()) {
            const isUpdating = this._isUpdating;
            this._isUpdating = true;
            this.onAttrsReceive(attrs, prevAttrs, children, prevChildren);
            this._isUpdating = isUpdating;
        }
    }

    this._parentNode = parentNode;
    this._children = children;
    this._ctx = ctx;

    if(this._isUpdating) {
        return;
    }

    const shouldUpdate = this.shouldUpdate(attrs, prevAttrs, children, prevChildren);

    if(process.env.NODE_ENV !== 'production') {
        const shouldUpdateResType = typeof shouldUpdate;
        if(shouldUpdateResType !== 'boolean') {
            console.warn(`Component#shouldUpdate() should return boolean instead of ${shouldUpdateResType}`);
        }
    }

    if(shouldUpdate) {
        this._rootNode = this.render();
        prevRootNode.patch(this._rootNode, parentNode);
        this.isMounted() && this.onUpdate(attrs, prevAttrs, children, prevChildren);
    }
}

function shouldComponentUpdate() {
    return true;
}

function renderComponentToDom(parentNode) {
    this._parentNode = parentNode;
    return this._rootNode.renderToDom(parentNode);
}

function renderComponentToString() {
    return this._rootNode.renderToString();
}

function adoptComponentDom(domNode, domIdx, parentNode) {
    this._parentNode = parentNode;
    return this._rootNode.adoptDom(domNode, domIdx, parentNode);
}

function getComponentDomNode() {
    return this._rootNode.getDomNode();
}

function getComponentAttrs() {
    return this._attrs;
}

function requestChildContext() {
    return emptyObj;
}

function requestInitialComponentState() {
    return emptyObj;
}

function setComponentState(state) {
    this._prevState = this._state;
    this._state = { ...this._state, ...state };

    this.update(updateComponentPrevState);
}

function updateComponentPrevState() {
    this._prevState = this._state;
}

function getComponentState() {
    return this._state;
}

function getComponentPrevState() {
    return this._prevState;
}

function renderComponent() {
    this._domRefs = {};

    const rootNode = this.onRender(this._attrs, this._children) || createNode('noscript');

    if(process.env.NODE_ENV !== 'production') {
        if(typeof rootNode !== 'object' || Array.isArray(rootNode)) {
            console.error('Component#onRender must return a single node object on the top level');
        }
    }

    const childCtx = this.onChildContextRequest(this._attrs);

    rootNode.ctx(childCtx === emptyObj?
        this._ctx :
        this._ctx === emptyObj?
            childCtx :
            { ...this._ctx, ...childCtx });

    return rootNode;
}

function updateComponent(cb, cbCtx) {
    if(this._isUpdating) {
        cb && rafBatch(() => cb.call(cbCtx || this));
    }
    else {
        this._isUpdating = true;
        rafBatch(() => {
            if(this.isMounted()) {
                this._isUpdating = false;
                var prevRootNode = this._rootNode;
                this.patch(this._attrs, this._children, this._ctx, this._parentNode);
                cb && cb.call(cbCtx || this);
                if(process.env.NODE_ENV !== 'production') {
                    globalHook.emit('replace', prevRootNode, this._rootNode);
                }
            }
        });
    }
}

function getComponentRootNode() {
    return this._rootNode;
}

function isComponentMounted() {
    return this._isMounted;
}

function setComponentDomRef(ref, node) {
    return this._domRefs[ref] = node;
}

function getComponentDomRef(ref) {
    return this._domRefs[ref]?
        this._domRefs[ref].getDomNode() :
        null;
}

function getComponentContext() {
    return this._ctx;
}

function getComponentDefaultAttrs() {
    return emptyObj;
}

function buildComponentAttrs(attrs) {
    if(this._attrs && attrs === this._attrs) {
        return attrs;
    }

    const cons = this.constructor,
        defaultAttrs = cons._defaultAttrs || (cons._defaultAttrs = cons.getDefaultAttrs());

    if(!attrs) {
        return defaultAttrs;
    }

    if(defaultAttrs === emptyObj) {
        return attrs;
    }

    const res = {};

    for(let i in defaultAttrs) {
        res[i] = defaultAttrs[i];
    }

    for(let i in attrs) {
        res[i] = attrs[i];
    }

    return res;
}

function createComponent(props, staticProps) {
    const res = function(attrs, children, ctx) {
            this._attrs = this._buildAttrs(attrs);
            this._children = children;
            this._ctx = ctx;
            this._parentNode = null;
            this._domRefs = null;
            this._isMounted = false;
            this._isUpdating = false;
            this._state = this.onInitialStateRequest(this._attrs);
            this._prevState = this._state;
            this.onInit(this._attrs);
            this._rootNode = this.render();
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
            getDomRef : getComponentDomRef,
            setDomRef : setComponentDomRef,
            getAttrs : getComponentAttrs,
            onChildContextRequest : requestChildContext,
            getContext : getComponentContext,
            _buildAttrs : buildComponentAttrs
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
