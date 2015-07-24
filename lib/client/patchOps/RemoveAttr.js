var domAttrsMutators = require('../domAttrsMutators'),
    domEventManager = require('../events/domEventManager'),
    ATTRS_TO_EVENTS = require('../events/attrsToEvents');

function RemoveAttr(attrName) {
    this._attrName = attrName;
}

RemoveAttr.prototype = {
    applyTo : function(domNode) {
        var attrName = this._attrName;

        ATTRS_TO_EVENTS[attrName]?
            domEventManager.removeListener(domNode, ATTRS_TO_EVENTS[attrName]) :
            domAttrsMutators(attrName).remove(domNode, attrName);
    }
};

module.exports = RemoveAttr;
