var ID_PROP = '__vidom__id__',
    counter = 1;

function getDomNodeId(node) {
    return node[ID_PROP] || (node[ID_PROP] = counter++);
}

module.exports = getDomNodeId;
