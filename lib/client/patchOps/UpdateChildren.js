var patchDom = require('../patchDom');

function UpdateChildren(children) {
    this._children = children;
}

UpdateChildren.prototype = {
    applyTo : function(domNode) {
        var j = 0,
            children = this._children,
            len = children.length,
            childDomNodes = domNode.childNodes,
            childPatch;

        while(j < len) {
            childPatch = children[j++];
            patchDom(childDomNodes[childPatch.idx], childPatch.patch);
        }
    }
};

module.exports = UpdateChildren;
