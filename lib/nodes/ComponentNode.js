var ReplaceOp = require('../client/patchOps/Replace'),
    UpdateComponentOp = require('../client/patchOps/UpdateComponent');

function ComponentNode(component) {
    this.type = ComponentNode;
    this._component = component;
    this._key = null;
    this._attrs = null;
    this._instance = null;
    this._children = null;
}

ComponentNode.prototype = {
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

    renderToDom : function() {
        return (this._instance || (this._instance = new this._component(this._attrs, this._children)))
            .renderToDom();
    },

    mount : function() {
        this._instance.mount();
    },

    unmount : function() {
        if(this._instance) {
            this._instance.unmount();
            this._instance = null;
        }
    },

    calcPatch : function(node, patch) {
        if(this.type !== node.type || this._component !== node._component) {
            patch.push(new ReplaceOp(this, node));
        }
        else {
            this._instance || (this._instance = new this._component(this._attrs, this._children));

            var componentPatch = this._instance.calcPatch(node._attrs, node._children);
            node._instance = this._instance;

            componentPatch.length && patch.push(new UpdateComponentOp(this._instance, componentPatch));
        }
    }
};

module.exports = ComponentNode;
