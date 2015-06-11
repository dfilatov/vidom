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
                domNode.parentNode.replaceChild(renderToDom(op.newNode), domNode);
            break;

            case patchOps.APPEND_CHILD:
                domNode.appendChild(renderToDom(op.childNode));
            break;

            case patchOps.REMOVE_CHILD:
                domNode.removeChild(domNode.childNodes[op.idx]);
                break;

            case patchOps.INSERT_CHILD:
                insertAt(domNode, renderToDom(op.childNode), op.idx);
            break;

            case patchOps.MOVE_CHILD:
                insertAt(domNode, domNode.childNodes[op.idxFrom], op.idxTo);
            break;

            case patchOps.REMOVE_CHILDREN:
                domNode.innerHTML = '';
            break;

            case patchOps.UPDATE_CHILDREN:
                var j = 0, childPatch;
                while(j < op.children.length) {
                    childPatch = op.children[j++];
                    applyPatch(domNode.childNodes[childPatch.idx], childPatch.patch);
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
