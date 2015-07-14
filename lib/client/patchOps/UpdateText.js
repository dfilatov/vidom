function UpdateText(text) {
    this._text = text;
}

UpdateText.prototype = {
    applyTo : function(domNode) {
        domNode.textContent = this._text;
    }
};

module.exports = UpdateText;
