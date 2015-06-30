function RemoveChildren(childNodes) {
    this._childNodes = childNodes;
}

RemoveChildren.prototype = {
    applyTo : function(domNode) {
        var j = 0,
            childNodes = this._childNodes,
            len = childNodes.length;

        while(j < len) {
            childNodes[j++].unmount();
        }

        domNode.innerHTML = '';
    }
};

module.exports = RemoveChildren;
