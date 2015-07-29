var noOp = require('./noOp'),
    rafBatch = require('./client/rafBatch'),
    patchDom = require('./client/patchDom'),
    calcPatch = require('./calcPatch'),
    createNode = require('./createNode'),
    emptyAttrs = {};

function mountComponent() {
    this._isMounted = true;
    this._rootNode.mount();
    this.onMount(this._attrs);
}

function unmountComponent() {
    this._isMounted = false;
    this._refs = null;
    this._rootNode.unmount();
    this.onUnmount();
}

function calcComponentPatch(attrs, children) {
    var prevRootNode = this._rootNode,
        prevAttrs = this._attrs;

    if(prevAttrs !== attrs) {
        this._attrs = attrs;
        this.isMounted() && this.onAttrsReceive(
            attrs || emptyAttrs,
            prevAttrs || emptyAttrs);
    }

    this._children = children;

    if(!this.isMounted()) {
        return [];
    }

    this._rootNode = this.render();

    return calcPatch(prevRootNode, this._rootNode);
}

function renderComponentToDom() {
    return this._domNode = this._rootNode.renderToDom(this);
}

function patchComponentDom(patch) {
    var newDomNode = patchDom(this._domNode, patch);
    newDomNode && (this._domNode = newDomNode);
    this.onUpdate(this._attrs);
}

function renderComponent() {
    this._refs = {};
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
    var patch = this.calcPatch(this._attrs, this._children);
    patch.length && this.patchDom(patch);
}

function isComponentMounted() {
    return this._isMounted;
}

function setComponentRef(ref, domNode) {
    this._refs[ref] = domNode;
}

function getComponentRef(ref) {
    return this._refs[ref] || null;
}

function createComponent(props, staticProps) {
    var res = function(attrs, children) {
            this._attrs = attrs;
            this._children = children;
            this._refs = null;
            this._rootNode = this.render();
            this._domNode = null;
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
            patchDom : patchComponentDom,
            render : renderComponent,
            onRender : noOp,
            update : updateComponent,
            updateSync : updateComponentSync,
            calcPatch : calcComponentPatch,
            getRef : getComponentRef,
            setRef : setComponentRef
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
