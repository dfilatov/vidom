var ReplaceOp = require('../client/patchOps/Replace'),
    UpdateTextOp = require('../client/patchOps/UpdateText'),
    noOp = require('../noOp'),
    doc = typeof document !== 'undefined'? document : null;

function TextNode() {
    this.type = TextNode;
    this._text = '';
    this._key = null;
}

TextNode.prototype = {
    text : function(text) {
        this._text = text;
        return this;
    },

    key : function(key) {
        this._key = key;
        return this;
    },

    renderToDom : function() {
        return doc.createTextNode(this._text);
    },

    mount : noOp,

    unmount : noOp,

    calcPatch : function(node, patch) {
        if(this.type !== node.type) {
            patch.push(new ReplaceOp(this, node));
        }
        else if(this._text !== node._text) {
            patch.push(new UpdateTextOp(node._text));
        }
    }
};

module.exports = TextNode;
