import patchOps from '../../../src/client/patchOps';
import { h } from '../../../src/vidom';

const oldNode = h('div'),
    newNode = h(() => h('div')),
    replaceOp = patchOps.replace;

export default {
    'name' : 'replace10',
    'trees' : [
        oldNode,
        newNode
    ],
    'patch' : [
        { op : replaceOp, args : [oldNode, newNode] }
    ]
};
