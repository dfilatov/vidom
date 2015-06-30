function RemoveChild(childNode, idx) {
    this._childNode = childNode;
    this._idx = idx;
}

RemoveChild.prototype = {
    applyTo : function(domNode) {
        this._childNode.unmount();
        domNode.removeChild(domNode.childNodes[this._idx]);
    }
};

module.exports = RemoveChild;
