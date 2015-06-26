var patchOps = require('./patchOps');

function diff(nodeA, nodeB, patch) {
    var isNodeAText = 'text' in nodeA,
        isNodeBText = 'text' in nodeB;

    if(isNodeAText || isNodeBText) {
        if(isNodeAText && isNodeBText) {
            if(nodeA.text !== nodeB.text) {
                patch.push({
                    type : patchOps.UPDATE_TEXT,
                    text : nodeB.text
                });
            }
        }
        else {
            patch.push({
                type : patchOps.REPLACE,
                node : nodeB
            });
        }
    }
    else if(nodeA.tag !== nodeB.tag || nodeA.ns !== nodeB.ns) {
        patch.push({
            type : patchOps.REPLACE,
            newNode : nodeB
        });
    }
    else {
        diffChildren(nodeA, nodeB, patch);
        diffAttrs(nodeA, nodeB, patch);
    }
}

function diffChildren(nodeA, nodeB, patch) {
    var childrenA = nodeA.children,
        childrenB = nodeB.children,
        hasChildrenA = childrenA && childrenA.length,
        hasChildrenB = childrenB && childrenB.length;

    if(!hasChildrenB) {
        hasChildrenA && patch.push({ type : patchOps.REMOVE_CHILDREN });
        return;
    }

    if(!hasChildrenA) {
        var iB = 0;
        while(iB < childrenB.length) {
            patch.push({
                type : patchOps.APPEND_CHILD,
                childNode : childrenB[iB++]
            });
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
            skippedAIndices = {},
            childrenBKeys = {},
            foundIdx, foundChildA, skippedCnt;

        iB = 0;
        while(iB < childrenBLen) {
            childB = childrenB[iB++];
            'key' in childB && (childrenBKeys[childB.key] = true);
        }

        iB = 0;
        while(iB < childrenBLen) {
            childB = childrenB[iB];

            while(skippedAIndices[iA]) {
                ++iA;
            }

            if(!hasChildrenA || iA >= childrenALen) {
                patch.push({
                    type : patchOps.APPEND_CHILD,
                    childNode : childB
                });
            }
            else {
                childA = childrenA[iA];
                if('key' in childB) {
                    if(childA.key === childB.key) {
                        addChildPatchToChildrenPatch(childA, childB, iB, childrenPatch);
                        ++iA;
                    }
                    else {
                        foundChildA = null;
                        skippedCnt = 0;
                        for(var j = iA + 1; j < childrenALen; j++) {
                            if(skippedAIndices[j]) {
                                ++skippedCnt;
                            }
                            else if(childrenA[j].key === childB.key) {
                                foundIdx = j - skippedCnt + iB - iA;
                                foundChildA = childrenA[j];
                                skippedAIndices[j] = true;
                                break;
                            }
                        }

                        if(foundChildA) {
                            foundIdx !== iB && patch.push({
                                type : patchOps.MOVE_CHILD,
                                idxFrom : foundIdx,
                                idxTo : iB
                            });
                            addChildPatchToChildrenPatch(foundChildA, childB, iB, childrenPatch);
                        }
                        else if('key' in childA && !(childrenBKeys[childA.key])) {
                            addChildPatchToChildrenPatch(childA, childB, iB, childrenPatch);
                            ++iA;
                        }
                        else {
                            patch.push({
                                type : patchOps.INSERT_CHILD,
                                idx : iB,
                                childNode : childB
                            });
                        }
                    }
                }
                else if('key' in childA) {
                    patch.push({
                        type : patchOps.INSERT_CHILD,
                        idx : iB,
                        childNode : childB
                    });
                }
                else {
                    addChildPatchToChildrenPatch(childA, childB, iB, childrenPatch);
                    ++iA;
                }
            }

            ++iB;
        }

        while(iA < childrenALen) {
            skippedAIndices[iA++] || patch.push({
                type : patchOps.REMOVE_CHILD,
                idx : iB
            });
        }
    }

    childrenPatch.length && patch.push({
        type : patchOps.UPDATE_CHILDREN,
        children : childrenPatch
    });
}

function addChildPatchToChildrenPatch(childA, childB, idx, childrenPatch) {
    var childPatch = [];
    diff(childA, childB, childPatch);
    childPatch.length && childrenPatch.push({ idx : idx, patch : childPatch });
}

function diffAttrs(nodeA, nodeB, patch) {
    var attrsA = nodeA.attrs,
        attrsB = nodeB.attrs,
        attrName;

    if(attrsB) {
        for(attrName in attrsB) {
            if(!attrsA || !(attrName in attrsA) || attrsA[attrName] !== attrsB[attrName]) {
                if(attrsB[attrName] == null) {
                    patch.push({
                        type : patchOps.REMOVE_ATTR,
                        attrName : attrName
                    });
                }
                else if(typeof attrsB[attrName] === 'object' && typeof attrsA[attrName] === 'object') {
                    diffAttrObj(attrName, attrsA[attrName], attrsB[attrName], patch);
                }
                else {
                    patch.push({
                        type : patchOps.UPDATE_ATTR,
                        attrName : attrName,
                        attrVal : attrsB[attrName]
                    });
                }
            }
        }
    }

    if(attrsA) {
        for(attrName in attrsA) {
            if((!attrsB || !(attrName in attrsB)) && attrsA[attrName] != null) {
                patch.push({
                    type : patchOps.REMOVE_ATTR,
                    attrName : attrName
                });
            }
        }
    }
}

function diffAttrObj(attrName, objA, objB, patch) {
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

    hasDiff && patch.push({
        type : patchOps.UPDATE_ATTR,
        attrName : attrName,
        attrVal : diffObj
    });
}

module.exports = function(treeA, treeB) {
    var res = [];
    diff(treeA, treeB, res);
    return res;
};
