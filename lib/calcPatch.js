var patchOps = require('./patchOps');

function diff(nodeA, nodeB, path, patch) {
    var isNodeAText = 'text' in nodeA,
        isNodeBText = 'text' in nodeB;

    if(isNodeAText || isNodeBText) {
        if(isNodeAText && isNodeBText) {
            diffText(nodeA, nodeB, path, patch);
        }
        else {
            diffMixed(nodeA, nodeB, path, patch);
        }
    }
    else if(nodeA.tag !== nodeB.tag || nodeA.ns !== nodeB.ns) {
        diffMixed(nodeA, nodeB, path, patch);
    }
    else {
        diffChildren(nodeA, nodeB, path, patch);
        diffAttrs(nodeA, nodeB, path, patch);
    }

    return patch;
}

function diffText(nodeA, nodeB, path, patch) {
    nodeA.text !== nodeB.text && patch.push({
        type : patchOps.UPDATE_TEXT,
        path : path,
        text : nodeB.text
    });
}

function diffMixed(nodeA, nodeB, path, patch) {
    patch.push({
        type : patchOps.REPLACE,
        path : path,
        newNode : nodeB
    });
}

function diffChildren(nodeA, nodeB, path, patch) {
    var childrenA = nodeA.children,
        childrenB = nodeB.children,
        hasChildrenA = childrenA && childrenA.length,
        hasChildrenB = childrenB && childrenB.length;

    if(!hasChildrenB) {
        hasChildrenA && patch.push({
            type : patchOps.REMOVE_CHILDREN,
            path : path
        });

        return;
    }

    var iA = 0, iB = 0,
        childA, childB,
        skippedAIndices = {},
        childrenBKeys = {};

    while(iB < childrenB.length) {
        childB = childrenB[iB++];
        'key' in childB && (childrenBKeys[childB.key] = true);
    }

    iB = 0;
    while(iB < childrenB.length) {
        childB = childrenB[iB];

        while(skippedAIndices[iA]) {
            ++iA;
        }

        if(!hasChildrenA || iA >= childrenA.length) {
            patch.push({
                type : patchOps.APPEND_CHILD,
                path : path,
                childNode : childB
            });
        }
        else {
            childA = childrenA[iA];
            if('key' in childB) {
                if(childA.key === childB.key) {
                    diff(childA, childB, appendToPath(path, iB), patch);
                    ++iA;
                }
                else {
                    var foundIdx, foundChildA,
                        skippedCnt = 0;
                    for(var j = iA + 1; j < childrenA.length; j++) {
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
                            path : path,
                            idxFrom : foundIdx,
                            idxTo : iB
                        });
                        diff(foundChildA, childB, appendToPath(path, iB), patch);
                    }
                    else if('key' in childA && !(childrenBKeys[childA.key])) {
                        diff(childA, childB, appendToPath(path, iB), patch);
                        ++iA;
                    }
                    else {
                        patch.push({
                            type : patchOps.INSERT_CHILD,
                            path : path,
                            idx : iB,
                            childNode : childB
                        });
                    }
                }
            }
            else if('key' in childA) {
                patch.push({
                    type : patchOps.INSERT_CHILD,
                    path : path,
                    idx : iB,
                    childNode : childB
                });
            }
            else {
                diff(childA, childB, appendToPath(path, iB), patch);
                ++iA;
            }
        }

        ++iB;
    }

    if(hasChildrenA) {
        var idx = iB;
        while(iA < childrenA.length) {
            skippedAIndices[iA++] || patch.push({
                type : patchOps.REMOVE_CHILD,
                path : path,
                idx : idx
            });
        }
    }
}

function diffAttrs(nodeA, nodeB, path, patch) {
    var attrsA = nodeA.attrs,
        attrsB = nodeB.attrs,
        attrName;

    if(attrsB) {
        for(attrName in attrsB) {
            if(!attrsA || !(attrName in attrsA) || attrsA[attrName] !== attrsB[attrName]) {
                if(attrsB[attrName] == null) {
                    patch.push({
                        type : patchOps.REMOVE_ATTR,
                        path : path,
                        attrName : attrName
                    });
                }
                else if(typeof attrsB[attrName] === 'object' && typeof attrsA[attrName] === 'object') {
                    diffAttrObj(attrName, attrsA[attrName], attrsB[attrName], path, patch);
                }
                else {
                    patch.push({
                        type : patchOps.UPDATE_ATTR,
                        path : path,
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
                    path : path,
                    attrName : attrName
                });
            }
        }
    }
}

function diffAttrObj(attrName, objA, objB, path, patch) {
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
        path : path,
        attrName : attrName,
        attrVal : diffObj
    });
}

function appendToPath(path, idx) {
    return path + '.' + idx;
}

module.exports = function(treeA, treeB) {
    return diff(treeA, treeB, '', []);
};
