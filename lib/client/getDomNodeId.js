var ID_PROP = '__vidom__id__',
    counter = 1;

function getDomNodeId(node, onlyGet) {
    return node[ID_PROP] || (onlyGet? null : node[ID_PROP] = counter++);
}

module.exports = getDomNodeId;
