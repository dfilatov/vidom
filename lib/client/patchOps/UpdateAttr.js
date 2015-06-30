var domAttrsMutators = require('../domAttrsMutators');

function UpdateAttr(attrName, attrVal) {
    this._attrName = attrName;
    this._attrVal = attrVal;
}

UpdateAttr.prototype = {
    applyTo : function(domNode) {
        domAttrsMutators(this._attrName).set(domNode, this._attrName, this._attrVal);
    }
};

module.exports = UpdateAttr;
