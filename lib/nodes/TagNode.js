var ReplaceOp = require('../client/patchOps/Replace'),
    RemoveChildrenOp = require('../client/patchOps/RemoveChildren'),
    AppendChildOp = require('../client/patchOps/AppendChild'),
    InsertChildOp = require('../client/patchOps/InsertChild'),
    MoveChildOp = require('../client/patchOps/MoveChild'),
    RemoveChildOp = require('../client/patchOps/RemoveChild'),
    UpdateChildrenOp = require('../client/patchOps/UpdateChildren'),
    UpdateAttrOp = require('../client/patchOps/UpdateAttr'),
    RemoveAttrOp = require('../client/patchOps/RemoveAttr'),
    calcPatch = require('../calcPatch'),
    domAttrsMutators = require('../client/domAttrsMutators'),
    TextNode = require('./TextNode'),
    doc = typeof document !== 'undefined'? document : null;

function TagNode(tag) {
    this.type = TagNode;
    this._tag = tag;
    this._key = null;
    this._ns = null;
    this._attrs = null;
    this._children = null;
}

TagNode.prototype = {
    key : function(key) {
        this._key = key;
        return this;
    },

    ns : function(ns) {
        this._ns = ns;
        return this;
    },

    attrs : function(attrs) {
        this._attrs = attrs;
        return this;
    },

    children : function(children) {
        this._children = processChildren(children);
        return this;
    },

    renderToDom : function() {
        var domNode = this._ns?
                doc.createElementNS(this._ns, this._tag) :
                doc.createElement(this._tag),
            attrs = this._attrs,
            name, value;

        for(name in attrs) {
            (value = attrs[name]) != null && domAttrsMutators(name).set(domNode, name, value);
        }

        var children = this._children;

        if(children) {
            var i = 0,
                len = children.length;

            while(i < len) {
                domNode.appendChild(children[i++].renderToDom());
            }
        }

        return domNode;
    },

    mount : function() {
        var children = this._children;

        if(children) {
            var i = 0,
                len = children.length;

            while(i < len) {
                children[i++].mount();
            }
        }
    },

    unmount : function() {
        var children = this._children;

        if(children) {
            var i = 0,
                len = children.length;

            while(i < len) {
                children[i++].unmount();
            }
        }
    },

    calcPatch : function(node, patch) {
        if(this.type !== node.type || this._tag !== node._tag || this._ns !== node._ns) {
            patch.push(new ReplaceOp(this, node));
        }
        else {
            this._calcChildrenPatch(node, patch);
            this._calcAttrsPatch(node, patch);
        }
    },

    _calcChildrenPatch : function(node, patch) {
        var childrenA = this._children,
            childrenB = node._children,
            hasChildrenA = childrenA && childrenA.length,
            hasChildrenB = childrenB && childrenB.length;

        if(!hasChildrenB) {
            hasChildrenA && patch.push(new RemoveChildrenOp(childrenA));
            return;
        }

        if(!hasChildrenA) {
            var iB = 0;
            while(iB < childrenB.length) {
                patch.push(new AppendChildOp(childrenB[iB++]));
            }
            return;
        }

        var childrenALen = childrenA.length,
            childrenBLen = childrenB.length,
            childrenPatch = [];

        if(childrenALen === 1 && childrenBLen === 1) {
            addChildPatchToChildrenPatch(childrenA[0], childrenB[0], 0, childrenPatch);
        }
        else {
            var iA = 0,
                childA, childB,
                childAKey, childBKey,
                skippedAIndices = {},
                childrenAKeys = buildKeys(childrenA),
                childrenBKeys = buildKeys(childrenB),
                foundIdx, foundChildA, skippedCnt;

            iB = 0;
            while(iB < childrenBLen) {
                childB = childrenB[iB];

                while(skippedAIndices[iA]) {
                    ++iA;
                }

                if(iA >= childrenALen) {
                    patch.push(new AppendChildOp(childB));
                    ++iB;
                }
                else {
                    childA = childrenA[iA];
                    childAKey = childA._key;
                    childBKey = childB._key;
                    if(childBKey != null) {
                        if(childrenAKeys[childBKey]) {
                            if(childAKey === childBKey) {
                                addChildPatchToChildrenPatch(childA, childB, iB, childrenPatch);
                                ++iA;
                                ++iB;
                            }
                            else if(childAKey == null || !childrenBKeys[childAKey]) {
                                patch.push(new RemoveChildOp(childA, iB));
                                ++iA;
                            }
                            else {
                                foundChildA = null;
                                skippedCnt = 0;
                                for(var j = iA + 1; j < childrenALen; j++) {
                                    if(skippedAIndices[j]) {
                                        ++skippedCnt;
                                    }
                                    else if(childrenA[j]._key === childBKey) {
                                        foundIdx = j - skippedCnt + iB - iA;
                                        foundChildA = childrenA[j];
                                        skippedAIndices[j] = true;
                                        break;
                                    }
                                }

                                foundIdx !== iB && patch.push(new MoveChildOp(foundIdx, iB));
                                addChildPatchToChildrenPatch(foundChildA, childB, iB, childrenPatch);
                                ++iB;
                            }
                        }
                        else {
                            if(childAKey != null && !childrenBKeys[childAKey]) {
                                addChildPatchToChildrenPatch(childA, childB, iB, childrenPatch);
                                ++iA;
                            }
                            else {
                                patch.push(new InsertChildOp(childB, iB));
                            }

                            ++iB;
                        }
                    }
                    else if(childAKey != null) {
                        if(childrenBKeys[childAKey]) {
                            patch.push(new InsertChildOp(childB, iB));
                            ++iB;
                        }
                        else {
                            patch.push(new RemoveChildOp(childA, iB));
                            ++iA;
                        }
                    }
                    else {
                        addChildPatchToChildrenPatch(childA, childB, iB, childrenPatch);
                        ++iA;
                        ++iB;
                    }
                }
            }

            while(iA < childrenALen) {
                skippedAIndices[iA] || patch.push(new RemoveChildOp(childrenA[iA], iB));
                ++iA;
            }
        }

        childrenPatch.length && patch.push(new UpdateChildrenOp(childrenPatch));
    },

    _calcAttrsPatch : function(node, patch) {
        var attrsA = this._attrs,
            attrsB = node._attrs,
            attrName;

        if(attrsB) {
            for(attrName in attrsB) {
                if(!attrsA || !(attrName in attrsA) || attrsA[attrName] !== attrsB[attrName]) {
                    if(attrsB[attrName] == null) {
                        patch.push(new RemoveAttrOp(attrName));
                    }
                    else if(typeof attrsB[attrName] === 'object' && typeof attrsA[attrName] === 'object') {
                        calcAttrObjPatch(attrName, attrsA[attrName], attrsB[attrName], patch);
                    }
                    else {
                        patch.push(new UpdateAttrOp(attrName, attrsB[attrName]));
                    }
                }
            }
        }

        if(attrsA) {
            for(attrName in attrsA) {
                if((!attrsB || !(attrName in attrsB)) && attrsA[attrName] != null) {
                    patch.push(new RemoveAttrOp(attrName));
                }
            }
        }
    }
};

function calcAttrObjPatch(attrName, objA, objB, patch) {
    var hasDiff = false,
        diffObj = {},
        i;

    for(i in objB) {
        if(objA[i] != objB[i]) {
            hasDiff = true;
            diffObj[i] = objB[i];
        }
    }

    for(i in objA) {
        if(objA[i] != null && !(i in objB)) {
            hasDiff = true;
            diffObj[i] = null;
        }
    }

    hasDiff && patch.push(new UpdateAttrOp(attrName, diffObj));
}

function addChildPatchToChildrenPatch(childA, childB, idx, childrenPatch) {
    var childPatch = [];
    calcPatch(childA, childB, childPatch);
    childPatch.length && childrenPatch.push({ idx : idx, patch : childPatch });
}

function processChildren(children) {
    return typeof children === 'string'?
        [new TextNode().text(children)] :
        children && (Array.isArray(children)? children : [children]);
}

function buildKeys(children) {
    var res = {},
        i = 0,
        len = children.length,
        child;

    while(i < len) {
        child = children[i++];
        child._key != null && (res[child._key] = true);
    }

    return res;
}

module.exports = TagNode;
