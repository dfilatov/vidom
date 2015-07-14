function AppendChild(childNode) {
    this._childNode = childNode;
}

AppendChild.prototype = {
    applyTo : function(domNode) {
        domNode.appendChild(this._childNode.renderToDom());
        this._childNode.mount();
    }
};

module.exports = AppendChild;
