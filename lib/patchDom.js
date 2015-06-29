var renderToDom = require('./renderToDom'),
    patchOps = require('./patchOps'),
    domAttrsMutators = require('./domAttrsMutators');

function applyPatch(domNode, patch) {
    var i = 0, op;
    while(i < patch.length) {
        op = patch[i++];
        //console.log(op);
        switch(op.type) {
            case patchOps.UPDATE_TEXT:
                domNode.nodeValue = op.text;
            break;

            case patchOps.UPDATE_ATTR:
                domAttrsMutators(op.attrName).set(domNode, op.attrName, op.attrVal);
            break;

            case patchOps.REMOVE_ATTR:
                domAttrsMutators(op.attrName).remove(domNode, op.attrName);
            break;

            case patchOps.REPLACE:
                domNode.parentNode.replaceChild(renderToDom(op.node), domNode);
            break;

            case patchOps.APPEND_CHILD:
                domNode.appendChild(renderToDom(op.node));
            break;

            case patchOps.REMOVE_CHILD:
                domNode.removeChild(domNode.childNodes[op.idx]);
                break;

            case patchOps.INSERT_CHILD:
                insertAt(domNode, renderToDom(op.node), op.idx);
            break;

            case patchOps.MOVE_CHILD:
                insertAt(domNode, domNode.childNodes[op.idxFrom], op.idxTo);
            break;

            case patchOps.REMOVE_CHILDREN:
                domNode.innerHTML = '';
            break;

            case patchOps.UPDATE_CHILDREN:
                var j = 0,
                    children = op.children,
                    len = children.length,
                    childNodes = domNode.childNodes,
                    childPatch;

                while(j < len) {
                    childPatch = children[j++];
                    applyPatch(childNodes[childPatch.idx], childPatch.patch);
                }
            break;

            default:
                throw Error('unsupported operation: ' + op.type);
        }
    }
}

function insertAt(parentNode, node, idx) {
    idx < parentNode.childNodes.length?
        parentNode.insertBefore(node, parentNode.childNodes[idx]) :
        parentNode.appendChild(node);
}

module.exports = applyPatch;
