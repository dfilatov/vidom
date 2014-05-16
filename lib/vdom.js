function merge(nodeA, nodeB, patch) {
    patch || (patch = []);

    var isNodeAText = 'text' in nodeA,
        isNodeBText = 'text' in nodeB;

    if(isNodeAText || isNodeBText) {
        isNodeAText && isNodeBText?
            mergeText(nodeA, nodeB, patch) :
            mergeMixed(nodeA, nodeB, patch);
    }
    else if(nodeA.tag !== nodeB.tag) {
        mergeMixed(nodeA, nodeB, patch);
    }
    else {
        mergeChildren(nodeA, nodeB, patch);
        mergeAttrs(nodeA, nodeB, patch);
    }

    nodeB.domNode = nodeA.domNode;

    return patch;
}

function mergeText(nodeA, nodeB, patch) {
    if(nodeA.text !== nodeB.text) {
        patch.push({
            type : 'updateText',
            node : nodeA,
            text : nodeB.text
        });
    }
}

function mergeMixed(nodeA, nodeB, patch) {
    patch.push({
        type : 'replaceNode',
        oldNode : nodeA,
        newNode : nodeB
    });
}

function mergeChildren(nodeA, nodeB, patch) {
    var childrenA = nodeA.children,
        childrenB = nodeB.children,
        hasChildrenA = childrenA && childrenA.length,
        hasChildrenB = childrenB && childrenB.length;

    if(!hasChildrenB) {
        hasChildrenA && patch.push({
            type : 'removeChildren',
            parentNode : nodeA
        });

        return;
    }

    var onlyAppend = !hasChildrenA,
        childA, childB, iA = 0, iB = 0;

    if(!onlyAppend) {
        var childrenAByKeys = {};
        while(childA = childrenA[iA]) {
            childA.key && (childrenAByKeys[childA.key] = { node : childA, idx : iA });
            ++iA;
        }
    }

    var skippedAIdxs = {};

    iA = 0;
    while(childB = childrenB[iB]) {
        if(onlyAppend) {
            patch.push({
                type : 'appendChild',
                parentNode : nodeA,
                childNode : childB
            });
        }
        else {
            if(childB.key) {
                if(childB.key === childrenA[iA].key) {
                    merge(childrenA[iA], childB, patch);
                    childB.domNode = childrenA[iA].domNode;
                    do {
                        iA++;
                    } while(skippedAIdxs[iA]);
                }
                else if(childA = childrenAByKeys[childB.key]) {
                    skippedAIdxs[childA.idx] = true;
                    patch.push({
                        type : 'moveChild',
                        parentNode : nodeA,
                        childNode : childA.node,
                        idx : iB
                    });
                    merge(childA.node, childB, patch);
                    childB.domNode = childA.node.domNode;
                }
                else {
                    patch.push({
                        type : 'insertChild',
                        parentNode : nodeA,
                        childNode : childB,
                        idx : iB
                    });
                }
            }
            else if(childrenA[iA].key) {
                patch.push({
                    type : 'insertChild',
                    parentNode : nodeA,
                    childNode : childB,
                    idx : iB
                });
            }
            else {
                merge(childrenA[iA], childB, patch);
                childB.domNode = childrenA[iA].domNode;
                do {
                    iA++;
                } while(skippedAIdxs[iA]);
            }

            iA >= childrenA.length && (onlyAppend = true);
        }

        ++iB;
    }

    if(hasChildrenA) {
        while(childA = childrenA[iA]) {
            skippedAIdxs[iA++] || patch.push({
                type : 'removeChild',
                parentNode : nodeA,
                childNode : childA
            });
        }
    }
}

function mergeAttrs(nodeA, nodeB, patch) {
    var attrsA = nodeA.attrs,
        attrsB = nodeB.attrs,
        attrName;

    if(attrsA) {
        for(attrName in attrsA) {
            if(!attrsB || !(attrName in attrsB)) {
                patch.push({
                    type : 'removeAttr',
                    node : nodeA,
                    attrName : attrName
                });
            }
            else if(attrsA[attrName] !== attrsB[attrName]) {
                patch.push({
                    type : 'updateAttr',
                    node : nodeA,
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
                    node : nodeA,
                    attrName : attrName,
                    attrVal : attrsB[attrName]
                });
            }
        }
    }
}
