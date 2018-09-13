import patchOps from '../../../src/client/patchOps';
import { h } from '../../../src/vidom';

const oldNode = h('plaintext'),
    newNode = h('div'),
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
