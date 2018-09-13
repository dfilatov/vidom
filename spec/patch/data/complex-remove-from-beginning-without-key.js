import patchOps from '../../../src/client/patchOps';
import { h } from '../../../src/vidom';

const nodeA = h('a'),
    nodeB = h('a');

export default {
    'name' : 'complex-remove-from-beginning-without-key',
    'trees' : [
        h('div', null, nodeA, nodeB, h('a', { key : 'c' }), h('a', { key : 'd' })),
        h('div', null, h('a', { key : 'c' }), h('a', { key : 'd' }))
    ],
    'patch' : [
        { op : patchOps.removeChild, args : [nodeA] },
        { op : patchOps.removeChild, args : [nodeB] }
    ]
};
