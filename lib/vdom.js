var vdom = (function() {

function diff(nodeA, nodeB, options, patch) {
    patch || (patch = []);

    var isNodeAText = 'text' in nodeA,
        isNodeBText = 'text' in nodeB;

    if(isNodeAText || isNodeBText) {
        isNodeAText && isNodeBText?
            diffText(nodeA, nodeB, patch) :
            diffMixed(nodeA, nodeB, patch);
    }
    else if(nodeA.tag !== nodeB.tag) {
        diffMixed(nodeA, nodeB, patch);
    }
    else {
        diffChildren(nodeA, nodeB, options, patch);
        diffAttrs(nodeA, nodeB, patch);
    }

    options.onNode && options.onNode(nodeA, nodeB);

    return patch;
}

function diffText(nodeA, nodeB, patch) {
    if(nodeA.text !== nodeB.text) {
        patch.push({
            type : 'updateText',
            node : nodeA,
            text : nodeB.text
        });
    }
}

function diffMixed(nodeA, nodeB, patch) {
    patch.push({
        type : 'replaceNode',
        oldNode : nodeA,
        newNode : nodeB
    });
}

function diffChildren(nodeA, nodeB, options, patch) {
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
                    diff(childrenA[iA], childB, options, patch);
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
                    diff(childA.node, childB, options, patch);
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
                diff(childrenA[iA], childB, options, patch);
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

function diffAttrs(nodeA, nodeB, patch) {
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

return {
    diff : diff
};

})();