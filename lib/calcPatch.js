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
    else if(nodeA.tag !== nodeB.tag) {
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
        type : 'updateText',
        path : path,
        text : nodeB.text
    });
}

function diffMixed(nodeA, nodeB, path, patch) {
    patch.push({
        type : 'replaceNode',
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
            type : 'removeChildren',
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
                type : 'appendChild',
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
                            type : 'moveChild',
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
                            type : 'insertChild',
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
                    type : 'insertChild',
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
                type : 'removeChild',
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

    if(attrsA) {
        for(attrName in attrsA) {
            if(!attrsB || !(attrName in attrsB)) {
                patch.push({
                    type : 'removeAttr',
                    path : path,
                    attrName : attrName
                });
            }
            else if(attrsA[attrName] !== attrsB[attrName]) {
                patch.push({
                    type : 'updateAttr',
                    path : path,
                    attrName : attrName,
                    attrVal : attrsB[attrName]
                });
            }
        }
    }

    if(attrsB) {
        for(attrName in nodeB.attrs) {
            if(!attrsA || !(attrName in attrsA)) {
                patch.push({
                    type : 'updateAttr',
                    path : path,
                    attrName : attrName,
                    attrVal : attrsB[attrName]
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
