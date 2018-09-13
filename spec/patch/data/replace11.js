import patchOps from '../../../src/client/patchOps';
import { h } from '../../../src/vidom';

const oldNode = h('div'),
    newNode = h('fragment'),
    replaceOp = patchOps.replace;

export default {
    'name' : 'replace11',
    'trees' : [
        oldNode,
        newNode
    ],
    'patch' : [
        { op : replaceOp, args : [oldNode, newNode] }
    ]
};
