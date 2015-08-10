var patchOps = require('../client/patchOps');

function ComponentNode(component) {
    this.type = ComponentNode;
    this._component = component;
    this._key = null;
    this._attrs = null;
    this._instance = null;
    this._children = null;
    this._ns = null;
    this._parentNode = null;
}

ComponentNode.prototype = {
    getDomNode : function() {
        return this._instance._domNode;
    },

    key : function(key) {
        this._key = key;
        return this;
    },

    attrs : function(attrs) {
        this._attrs = attrs;
        return this;
    },

    children : function(children) {
        this._children = children;
        return this;
    },

    renderToDom : function(parentNode) {
        if(parentNode) {
            this._parentNode = parentNode;
            this._ns || (this._ns = parentNode._ns);
        }

        this._instance || (this._instance = new this._component(this._attrs, this._children));
        return this._domNode = this._instance.renderToDom(this);
    },

    renderToString : function(ctx) {
        this._instance || (this._instance = new this._component(this._attrs, this._children));
        return this._instance.renderToString(ctx);
    },

    mount : function() {
        this._instance.mount();
    },

    unmount : function() {
        if(this._instance) {
            this._instance.unmount();
            this._instance = null;
        }

        this._parentNode = null;
    },

    patch : function(node) {
        if(this.type !== node.type || this._component !== node._component) {
            return patchOps.replace(this._parentNode, this, node);
        }

        this._instance || (this._instance = new this._component(this._attrs, this._children));
        this._instance.patch(node._attrs, node._children);

        node._instance = this._instance;
    }
};

module.exports = ComponentNode;
