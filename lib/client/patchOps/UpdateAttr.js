var domAttrsMutators = require('../domAttrsMutators'),
    domEventManager = require('../events/domEventManager'),
    ATTRS_TO_EVENTS = require('../events/attrsToEvents');

function UpdateAttr(attrName, attrVal) {
    this._attrName = attrName;
    this._attrVal = attrVal;
}

UpdateAttr.prototype = {
    applyTo : function(domNode) {
        var attrName = this._attrName,
            attrVal = this._attrVal;

        ATTRS_TO_EVENTS[attrName]?
            domEventManager.addListener(domNode, ATTRS_TO_EVENTS[attrName], attrVal) :
            domAttrsMutators(attrName).set(domNode, attrName, attrVal);
    }
};

module.exports = UpdateAttr;
