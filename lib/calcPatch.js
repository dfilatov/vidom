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

function increaseIndices(children, from, to) {
    for(var key in children) {
        if(children[key].idx >= from && (!to || children[key].idx <= to)) {
            ++children[key].idx;
        }
    }
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

    var children = hasChildrenA? childrenA.slice() : null,
        onlyAppend = !hasChildrenA,
        iA = 0, iB = 0,
        childB;

    while(childB = childrenB[iB]) {
        if(onlyAppend) {
            patch.push({
                type : 'appendChild',
                path : path,
                childNode : childB
            });
        }
        else {
            if(childB.key) {
                if(childB.key === children[iB].key) {
                    diff(children[iB], childB, appendToPath(path, iB), patch);
                }
                else {
                    var foundIdx = null;
                    for(var i = iB + 1; i < children.length; i++) {
                        if(children[i].key === childB.key) {
                            foundIdx = i;
                            break;
                        }
                    }

                    if(foundIdx !== null) {
                        patch.push({
                            type : 'moveChild',
                            path : path,
                            idxFrom : foundIdx,
                            idxTo : iB
                        });
                        children.splice(iB, 0, children[foundIdx]);
                        children.splice(foundIdx + 1, 1);
                        diff(children[iB], childB, appendToPath(path, iB), patch);
                    }
                    else {
                        patch.push({
                            type : 'insertChild',
                            path : path,
                            idx : iB,
                            childNode : childB
                        });
                        children.splice(iB, 0, childB);
                    }
                }
            }
            else if(children[iB].key) {
                patch.push({
                    type : 'insertChild',
                    path : path,
                    idx : iB,
                    childNode : childB
                });
                children.splice(iB, 0, childB);
            }
            else {
                diff(childrenA[iA], childB, appendToPath(path, iB), patch);
            }

            iB >= children.length && (onlyAppend = true);
        }

        ++iB;
    }

    if(hasChildrenA) {
        var idx = iB;
        while(iB++ < children.length) {
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
