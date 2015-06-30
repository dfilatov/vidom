function InsertChild(childNode, idx) {
    this._childNode = childNode;
    this._idx = idx;
}

InsertChild.prototype = {
    applyTo : function(domNode) {
        insertAt(domNode, this._childNode.renderToDom(), this._idx);
        this._childNode.mount();
    }
};

function insertAt(parentNode, node, idx) {
    idx < parentNode.childNodes.length?
        parentNode.insertBefore(node, parentNode.childNodes[idx]) :
        parentNode.appendChild(node);
}

module.exports = InsertChild;
