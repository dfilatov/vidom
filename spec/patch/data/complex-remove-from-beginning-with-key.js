import patchOps from '../../../src/client/patchOps';
import { h } from '../../../src/vidom';

const nodeA = h('a', { key : 'a' }),
    nodeB = h('a', { key : 'b' });

export default {
    'name' : 'complex-remove-from-beginning-with-key',
    'trees' : [
        h('div', null, nodeA, nodeB, h('a', { key : 'c' }), h('a', { key : 'd' })),
        h('div', null, h('a', { key : 'c' }), h('a', { key : 'd' }))
    ],
    'patch' : [
        { op : patchOps.removeChild, args : [nodeA] },
        { op : patchOps.removeChild, args : [nodeB] }
    ]
};
