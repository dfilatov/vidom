var renderToDom = require('./renderToDom');

function insertAt(parentNode, node, idx) {
    console.log(parentNode, node, idx);
    idx < parentNode.childNodes.length - 1?
        parentNode.insertBefore(node, parentNode.childNodes[idx]) :
        parentNode.appendChild(node);
}

function applyPatch(node, patch) {
    var i = 0, op;
    while(op = patch[i++]) {
        //console.log(op);
        var domNode = getDomNode(node, op.path);
        switch(op.type) {
            case 'updateText':
                domNode.nodeValue = op.text;
            break;

            case 'replaceNode':
                domNode.parentNode.replaceChild(renderToDom(op.newNode), domNode);
            break;

            case 'updateAttr':
                domNode[op.attrName] = op.attrVal;
            break;

            case 'removeAttr':
                domNode.removeAttribute(op.attrName);
            break;

            case 'appendChild':
                domNode.appendChild(renderToDom(op.childNode));
            break;

            case 'removeChild':
                domNode.removeChild(domNode.childNodes[op.idx]);
            break;

            case 'insertChild':
                insertAt(domNode, renderToDom(op.childNode), op.idx);
            break;

            case 'moveChild':
                insertAt(domNode, domNode.childNodes[op.idxFrom], op.idxTo);
            break;

            case 'removeChildren':
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

module.exports = applyPatch;
