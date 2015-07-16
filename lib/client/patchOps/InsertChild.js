function InsertChild(childNode, idx) {
    this._childNode = childNode;
    this._idx = idx;
}

InsertChild.prototype = {
    applyTo : function(domNode) {
        domNode.insertBefore(this._childNode.renderToDom(), domNode.childNodes[this._idx]);
        this._childNode.mount();
    }
};

module.exports = InsertChild;
