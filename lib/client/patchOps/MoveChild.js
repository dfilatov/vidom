function MoveChild(idxFrom, idxTo) {
    this._idxFrom = idxFrom;
    this._idxTo = idxTo;
}

MoveChild.prototype = {
    applyTo : function(domNode) {
        var childDomNodes = domNode.childNodes;
        domNode.insertBefore(childDomNodes[this._idxFrom], childDomNodes[this._idxTo]);
    }
};

module.exports = MoveChild;
