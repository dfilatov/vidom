import patchOps from '../../../src/client/patchOps';
import { h } from '../../../src/vidom';

const newNode = h('input', { key : 'b' }),
    nodeC = h('input', { key : 'c' });

export default {
    'name' : 'insertChild1',
    'trees' : [
        h('div', null, h('input', { key : 'a' }), h('input', { key : 'c' })),
        h('div', null, h('input', { key : 'a' }), newNode, nodeC)
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [newNode, nodeC] }
    ]
};
