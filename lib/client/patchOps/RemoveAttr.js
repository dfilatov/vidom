var domAttrsMutators = require('../domAttrsMutators');

function RemoveAttr(attrName) {
    this._attrName = attrName;
}

RemoveAttr.prototype = {
    applyTo : function(domNode) {
        domAttrsMutators(this._attrName).remove(domNode, this._attrName);
    }
};

module.exports = RemoveAttr;
