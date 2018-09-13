import patchOps from '../../../src/client/patchOps';
import { h } from '../../../src/vidom';

const nodeA = h('a', { key : 'a' }),
    nodeB = h('a', { key : 'b' }),
    nodeC = h('a', { key : 'c' }),
    nodeD = h('a', { key : 'd' });

export default {
    'name' : 'complex-reverse',
    'trees' : [
        h('div', null, nodeA, nodeB, nodeC, nodeD),
        h('div', null, h('a', { key : 'd' }), h('a', { key : 'c' }), h('a', { key : 'b' }), h('a', { key : 'a' }))
    ],
    'patch' : [
        { op : patchOps.moveChild, args : [nodeA, nodeD, true] },
        { op : patchOps.moveChild, args : [nodeB, nodeD, true] },
        { op : patchOps.moveChild, args : [nodeC, nodeD, true] }
    ]
};
