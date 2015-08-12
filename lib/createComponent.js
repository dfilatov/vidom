var noOp = require('./noOp'),
    rafBatch = require('./client/rafBatch'),
    createNode = require('./createNode'),
    emptyAttrs = {};

function mountComponent() {
    this._isMounted = true;
    this._rootNode.mount();
    this.onMount(this._attrs);
}

function unmountComponent() {
    this._isMounted = false;
    this._domRefs = null;
    this._rootNode.unmount();
    this.onUnmount();
}

function patchComponent(attrs, children) {
    var prevRootNode = this._rootNode,
        prevAttrs = this._attrs;

    if(prevAttrs !== attrs) {
        this._attrs = attrs;
        this.isMounted() && this.onAttrsReceive(
            attrs || emptyAttrs,
            prevAttrs || emptyAttrs);
    }

    this._children = children;

    if(this.isMounted()) {
        this._rootNode = this.render();
        prevRootNode.patch(this._rootNode);
        this.onUpdate(attrs);
    }
}

function renderComponentToDom(parentNode) {
    return this._rootNode.renderToDom(parentNode);
}

function renderComponentToString(ctx) {
    return this._rootNode.renderToString(ctx);
}

function adoptComponentDom(domNode, parentNode) {
    this._rootNode.adoptDom(domNode, parentNode);
}

function renderComponent() {
    this._domRefs = {};
    return this.onRender(this._attrs || emptyAttrs, this._children) ||
        createNode('noscript');
}

function updateComponent(cb, cbCtx) {
    if(this._isUpdating) {
        cb && rafBatch(function() {
            cb.call(cbCtx || this);
        }, this);
    }
    else {
        this._isUpdating = true;
        rafBatch(function() {
            if(this.isMounted()) {
                this.updateSync();
                this._isUpdating = false;
                cb && cb.call(cbCtx || this);
            }
        }, this);
    }
}

function updateComponentSync() {
    this.patch(this._attrs, this._children);
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

function createComponent(props, staticProps) {
    var res = function(attrs, children) {
            this._attrs = attrs;
            this._children = children;
            this._domRefs = null;
            this._rootNode = this.render();
            this._isMounted = false;
            this._isUpdating = false;
        },
        ptp = {
            mount : mountComponent,
            unmount : unmountComponent,
            onMount : noOp,
            onUnmount : noOp,
            onAttrsReceive : noOp,
            onUpdate : noOp,
            isMounted : isComponentMounted,
            renderToDom : renderComponentToDom,
            renderToString : renderComponentToString,
            adoptDom : adoptComponentDom,
            render : renderComponent,
            onRender : noOp,
            update : updateComponent,
            updateSync : updateComponentSync,
            patch : patchComponent,
            getDomRef : getComponentDomRef,
            setDomRef : setComponentDomRef
        },
        i;

    for(i in props) {
        ptp[i] = props[i];
    }

    res.prototype = ptp;

    for(i in staticProps) {
        res[i] = staticProps[i];
    }

    return res;
}

module.exports = createComponent;
