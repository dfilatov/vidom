import createElement from '../../createElement';
import normalizeNode from './normalizeNode';

export default function nodeToElement(node) {
    const normalizedNode = normalizeNode(node);

    return normalizedNode === null?
        createElement('!') :
        typeof normalizedNode === 'object'?
            Array.isArray(normalizedNode)?
                createElement('fragment', null, null, normalizedNode) :
                normalizedNode :
            createElement('plaintext', null, null, normalizedNode);
}
