var renderToDom = require('./renderToDom'),
    patchOps = require('./patchOps'),
    domAttrsMutators = require('./domAttrsMutators');

function applyPatch(node, patch) {
    var i = 0, op, domNode;
    while(i < patch.length) {
        op = patch[i++];
        domNode = getDomNode(node, op.path);
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

            default:
                throw Error('unsupported operation: ' + op.type);
        }
    }
}

function getDomNode(tree, idx) {
    var path = idx.split('.'),
        i = 1,
        res = tree;

    while(i < path.length) {
        res = res.childNodes[path[i++]];
    }

    return res;
}

function insertAt(parentNode, node, idx) {
    idx < parentNode.childNodes.length?
        parentNode.insertBefore(node, parentNode.childNodes[idx]) :
        parentNode.appendChild(node);
}

module.exports = applyPatch;
