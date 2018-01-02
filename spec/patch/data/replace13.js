import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const oldNode = createElement('plaintext'),
    newNode = createElement('div'),
    replaceOp = patchOps.replace;

export default {
    'name' : 'replace13',
    'trees' : [
        oldNode,
        newNode
    ],
    'patch' : [
        { op : replaceOp, args : [oldNode, newNode] }
    ]
};
