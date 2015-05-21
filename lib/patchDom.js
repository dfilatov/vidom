var renderToDom = require('./renderToDom');

function insertAt(parentNode, node, idx) {
    idx < parentNode.childNodes.length - 1?
        parentNode.insertBefore(node, parentNode.childNodes[idx + 1]) :
        parentNode.appendChild(node);
}

function applyPatch(patch) {
    var i = 0, op;
    while(op = patch[i++]) {
        //console.log(op);
        switch(op.type) {
            case 'updateText':
                getDomNode(op.node).nodeValue = op.text;
            break;

            case 'replaceNode':
                var oldNode = op.oldNode,
                    oldDomNode = getDomNode(oldNode),
                    newDomNode = renderToDom(op.newNode);

                oldDomNode.parentNode.replaceChild(newDomNode, oldDomNode);
            break;

            case 'updateAttr':
                getDomNode(op.node)[op.attrName] = op.attrVal;
            break;

            case 'removeAttr':
                getDomNode(op.node).removeAttribute(op.attrName);
            break;

            case 'appendChild':
                getDomNode(op.parentNode).appendChild(renderToDom(op.childNode));
            break;

            case 'removeChild':
                getDomNode(op.parentNode).removeChild(getDomNode(op.childNode));
            break;

            case 'insertChild':
                insertAt(getDomNode(op.parentNode), renderToDom(op.childNode), op.idx);
            break;

            case 'moveChild':
                insertAt(getDomNode(op.parentNode), getDomNode(op.childNode), op.idx);
            break;

            case 'removeChildren':
                getDomNode(op.parentNode).innerHTML = '';
            break;

            default:
                throw Error('unsupported operation: ' + op.type);
        }
    }
}

function getDomNode(node) {
    var res;

    if(node.domNode) {
        res = node.domNode;
    }
    else {
        var prevNode = node;
        while(prevNode = prevNode.prev) {
            if(prevNode.domNode) {
                res = node.domNode = prevNode.domNode;
                break;
            }
        }

        if(!node.domNode) {
            res = renderToDom(node);
        }
    }

    node.prev && (node.prev = null);

    return res;
}

module.exports = applyPatch;
