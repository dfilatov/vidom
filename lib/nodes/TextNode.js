var patchOps = require('../client/patchOps'),
    noOp = require('../noOp'),
    doc = typeof document !== 'undefined'? document : null;

function TextNode() {
    this.type = TextNode;
    this._domNode = null;
    this._text = '';
    this._key = null;
    this._parentNode = null;
}

TextNode.prototype = {
    getDomNode : function() {
        return this._domNode;
    },

    text : function(text) {
        this._text = text;
        return this;
    },

    key : function(key) {
        this._key = key;
        return this;
    },

    renderToDom : function(parentNode) {
        parentNode && (this._parentNode = parentNode);

        return this._domNode = doc.createTextNode(this._text);
    },

    mount : noOp,

    unmount : function() {
        this._domNode = null;
        this._parentNode = null;
    },

    patch : function(node) {
        if(this.type !== node.type) {
            return patchOps.replace(this._parentNode, this, node);
        }

        if(this._text !== node._text) {
            patchOps.updateText(this, node._text);
        }
    }
};

module.exports = TextNode;
