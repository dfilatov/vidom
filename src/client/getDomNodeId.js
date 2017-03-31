const ID_PROP = '__vidom__id__';
let counter = 1;

function getDomNodeId(node, onlyGet) {
    return ID_PROP in node?
        node[ID_PROP] :
        onlyGet?
            null :
            node[ID_PROP] = counter++;
}

export default getDomNodeId;
