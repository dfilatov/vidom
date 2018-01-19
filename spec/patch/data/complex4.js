import patchOps from '../../../src/client/patchOps';
import { h } from '../../helpers';

const nodeC = h('a', { key : 'c' }),
    nodeBAA = h('b', { key : 'baa' }),
    nodeBAB = h('b', { key : 'bab' }),
    nodeBA = h('fragment', { key : 'ba', children : [
        nodeBAA,
        nodeBAB
    ] }),
    nodeBB = h('a', { key : 'bb' }),
    nodeB = h('fragment', { key : 'b', children : [
        nodeBA,
        nodeBB
    ] }),
    nodeD = h('a', { key : 'd' }),
    parentNode = h('fragment', { children : [
        h('a', { key : 'a' }),
        h('a', { key : 'c' }),
        h('fragment', { key : 'b', children : [
            h('a', { key : 'bb' }),
            h('fragment', { key : 'ba', children : [
                h('b', { key : 'bab' }),
                h('b', { key : 'baa' })
            ] })
        ] })
    ] });

export default {
    'name' : 'complex4',
    'trees' : [
        h('fragment', { children : [
            h('a', { key : 'a' }),
            nodeB,
            nodeC,
            nodeD
        ] }),
        parentNode
    ],
    'patch' : [
        { op : patchOps.moveChild, args : [nodeB, nodeD, true] },
        { op : patchOps.moveChild, args : [nodeBA, nodeBB, true] },
        { op : patchOps.moveChild, args : [nodeBAA, nodeBAB, true] },
        { op : patchOps.removeChild, args : [nodeD] }
    ]
};
