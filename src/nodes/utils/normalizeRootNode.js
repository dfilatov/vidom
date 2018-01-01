import createNode from '../../createNode';
import normalizeChildren from '../../utils/normalizeChildren';

export default function normalizeRootNode(node) {
    const normalizedNode = normalizeChildren(node);

    return normalizedNode === null?
        createNode('!') :
        typeof normalizedNode === 'object'?
            Array.isArray(normalizedNode)?
                createNode('fragment').setChildren(normalizedNode) :
                node :
            createNode('plaintext').setChildren(node);
}
