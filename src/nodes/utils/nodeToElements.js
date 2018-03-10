import createElement from '../../createElement';
import normalizeNode from './normalizeNode';

export default function nodeToElements(node) {
    const normalizedNode = normalizeNode(node);

    return normalizedNode === null?
        [] :
        typeof normalizedNode === 'string'?
            [createElement('plaintext', null, null, normalizedNode)] :
            Array.isArray(normalizedNode)?
                normalizedNode :
                [normalizedNode];
}
