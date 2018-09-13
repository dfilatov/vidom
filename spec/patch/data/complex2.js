import patchOps from '../../../src/client/patchOps';
import { h } from '../../../src/vidom';

const nodeB = h('a', { key : 'b' }),
    nodeC = h('a', { key : 'c' }),
    nodeD = h('a', { key : 'd' }),
    nodeE = h('a', { key : 'e' }),
    nodeF = h('a', { key : 'f' }),
    parentNode = h('div', null, [
        h('a', { key : 'a' }),
        nodeB,
        h('a', { key : 'c' }),
        nodeD,
        h('a', { key : 'e' }),
        nodeF
    ]);

export default {
    'name' : 'complex2',
    'trees' : [
        h('div', null, h('a', { key : 'a' }), nodeC, nodeE),
        parentNode
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [nodeB, nodeC] },
        { op : patchOps.insertChild, args : [nodeD, nodeE] },
        { op : patchOps.appendChild, args : [parentNode, nodeF] }
    ]
};
