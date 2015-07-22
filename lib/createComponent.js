var noOp = require('./noOp'),
    rafBatch = require('./client/rafBatch'),
    patchDom = require('./client/patchDom'),
    calcPatch = require('./calcPatch'),
    createNode = require('./createNode'),
    emptyAttrs = {};

function mountComponent() {
    this._isMounted = true;
    this._rootNode.mount();
    this.onMount();
}

function unmountComponent() {
    this._isMounted = false;
    this._rootNode.unmount();
    this.onUnmount();
}

function calcComponentPatch(attrs, children) {
    var prevRootNode = this._rootNode,
        prevAttrs = this._attrs;

    if(prevAttrs !== attrs) {
        this._attrs = attrs;
        this.onAttrsReceive(attrs || emptyAttrs, prevAttrs || emptyAttrs);
    }

    this._children = children;
    this._rootNode = this.render();

    if(!this.isMounted()) {
        return [];
    }

    return calcPatch(prevRootNode, this._rootNode);
}

function renderComponentToDom() {
    return this._domNode = this._rootNode.renderToDom(this);
}

function patchComponentDom(patch) {
    var newDomNode = patchDom(this._domNode, patch);
    newDomNode && (this._domNode = newDomNode);
    this.onUpdate();
}

function renderComponent() {
    return this.onRender(this._attrs || emptyAttrs, this._children) ||
        createNode('noscript');
}

function updateComponent(cb, cbCtx) {
    var patch = this.calcPatch(this._attrs, this._children);
    patch.length?
        rafBatch(function() {
            if(this.isMounted()) {
                this.patchDom(patch);
                cb && cb.call(cbCtx || this);
            }
        }, this) :
        cb && cb.call(cbCtx || this);
}

function updateComponentSync() {
    var patch = this.calcPatch(this._attrs, this._children);
    patch.length && this.patchDom(patch);
}

function isComponentMounted() {
    return this._isMounted;
}

function createComponent(props, staticProps) {
    var res = function(attrs, children) {
            this._attrs = attrs;
            this._children = children;
            this._rootNode = this.render();
            this._domNode = null;
            this._isMounted = false;
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
            calcPatch : calcComponentPatch
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
