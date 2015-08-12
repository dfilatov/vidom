import TagNode from './nodes/TagNode';
import ComponentNode from './nodes/ComponentNode';

function createNode(type) {
    switch(typeof type) {
        case 'string':
            return new TagNode(type);

        case 'function':
            return new ComponentNode(type);

        default:
            throw Error('unsupported node type: ' + typeof type);
    }
}

export default createNode;
