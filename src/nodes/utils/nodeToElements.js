import createElement from '../../createElement';
import normalizeNode from './normalizeNode';

export default function nodeToElements(children) {
    const normalizedNode = normalizeNode(children);

    return normalizedNode === null?
        [] :
        typeof normalizedNode === 'string'?
            [createElement('plaintext', null, null, normalizedNode)] :
            Array.isArray(normalizedNode)?
                normalizedNode :
                [normalizedNode];
}
