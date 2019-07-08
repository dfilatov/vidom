import patchOps from '../../../src/client/patchOps';
import { h } from '../../../src/vidom';

const oldNode = h('div', { key : 'a' }),
    newNode = h('div', { key : 'b' }),
    replaceOp = patchOps.replace;

export default {
    'name' : 'replace14',
    'trees' : [
        h('div', null, [oldNode]),
        h('div', null, [newNode])
    ],
    'patch' : [
        { op : replaceOp, args : [oldNode, newNode] }
    ]
};
