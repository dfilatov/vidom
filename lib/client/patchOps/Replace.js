function Replace(oldNode, newNode) {
    this._oldNode = oldNode;
    this._newNode = newNode;
}

Replace.prototype = {
    applyTo : function(domNode) {
        this._oldNode.unmount();
        var newDomNode = this._newNode.renderToDom();
        domNode.parentNode.replaceChild(newDomNode, domNode);
        this._newNode.mount();
        return newDomNode;
    }
};

module.exports = Replace;
