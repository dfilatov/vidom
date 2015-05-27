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

    var curChildren = hasChildrenA? childrenA.slice() : null,
        i = 0, childB;

    while(i < childrenB.length) {
        childB = childrenB[i];

        if(!curChildren || i >= curChildren.length) {
            patch.push({
                type : patchOps.APPEND_CHILD,
                path : path,
                childNode : childB
            });
        }
        else {
            if(childB.key) {
                if(childB.key === curChildren[i].key) {
                    diff(curChildren[i], childB, appendToPath(path, i), patch);
                }
                else {
                    var foundIdx = null;
                    for(var j = i + 1; j < curChildren.length; j++) {
                        if(curChildren[j].key === childB.key) {
                            foundIdx = j;
                            break;
                        }
                    }

                    if(foundIdx !== null) {
                        patch.push({
                            type : patchOps.MOVE_CHILD,
                            path : path,
                            idxFrom : foundIdx,
                            idxTo : i
                        });
                        curChildren.splice(i, 0, curChildren[foundIdx]);
                        curChildren.splice(foundIdx + 1, 1);
                        diff(curChildren[i], childB, appendToPath(path, i), patch);
                    }
                    else {
                        patch.push({
                            type : patchOps.INSERT_CHILD,
                            path : path,
                            idx : i,
                            childNode : childB
                        });
                        curChildren.splice(i, 0, childB);
                    }
                }
            }
            else if(curChildren[i].key) {
                patch.push({
                    type : patchOps.INSERT_CHILD,
                    path : path,
                    idx : i,
                    childNode : childB
                });
                curChildren.splice(i, 0, childB);
            }
            else {
                diff(curChildren[i], childB, appendToPath(path, i), patch);
            }
        }

        ++i;
    }

    if(hasChildrenA) {
        var idx = i;
        while(i++ < curChildren.length) {
            patch.push({
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
                patch.push(
                    attrsB[attrName] == null?
                        {
                            type : patchOps.REMOVE_ATTR,
                            path : path,
                            attrName : attrName
                        } :
                        {
                            type : patchOps.UPDATE_ATTR,
                            path : path,
                            attrName : attrName,
                            attrVal : attrsB[attrName]
                        });
            }
        }
    }

    if(attrsA) {
        for(attrName in attrsA) {
            if(!attrsB || !(attrName in attrsB)) {
                patch.push({
                    type : patchOps.REMOVE_ATTR,
                    path : path,
                    attrName : attrName
                });
            }
        }
    }
}

function appendToPath(path, idx) {
    return path + '.' + idx;
}

module.exports = function(treeA, treeB) {
    return diff(treeA, treeB, '', []);
};
