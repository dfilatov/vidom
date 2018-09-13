import patchOps from '../../../src/client/patchOps';
import { h } from '../../../src/vidom';

const nodeC = h('a'),
    nodeD = h('a'),
    parentNode = h('div', null, h('a', { key : 'a' }), h('a', { key : 'b' }), nodeC, nodeD);

export default {
    'name' : 'complex-insert-to-ending-without-key',
    'trees' : [
        h('div', null, h('a', { key : 'a' }),h('a', { key : 'b' })),
        parentNode
    ],
    'patch' : [
        { op : patchOps.appendChild, args : [parentNode, nodeC] },
        { op : patchOps.appendChild, args : [parentNode, nodeD] }
    ]
};
