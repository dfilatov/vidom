function MoveChild(idxFrom, idxTo) {
    this._idxFrom = idxFrom;
    this._idxTo = idxTo;
}

MoveChild.prototype = {
    applyTo : function(domNode) {
        insertAt(domNode, domNode.childNodes[this._idxFrom], this._idxTo);
    }
};

function insertAt(parentNode, node, idx) {
    idx < parentNode.childNodes.length?
        parentNode.insertBefore(node, parentNode.childNodes[idx]) :
        parentNode.appendChild(node);
}

module.exports = MoveChild;
