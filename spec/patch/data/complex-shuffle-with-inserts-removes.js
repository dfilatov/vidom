import { h } from '../../helpers';
import patchOps from '../../../src/client/patchOps';

const nodeA = h('a', { key : 'a' }),
    nodeB = h('a', { key : 'b' }),
    nodeC = h('a', { key : 'c' }),
    nodeD = h('a', { key : 'd' }),
    nodeE = h('a', { key : 'e' }),
    nodeF = h('a', { key : 'f' }),
    nodeG = h('a', { key : 'g' });

export default {
    'name' : 'complex-shuffle-with-inserts-removes',
    'trees' : [
        h('div', { children : [
            nodeA,
            nodeB,
            nodeC,
            nodeD
        ] }),
        h('div', { children : [
            nodeE,
            h('a', { key : 'b' }),
            nodeF,
            nodeG,
            h('a', { key : 'c' }),
            h('a', { key : 'a' })
        ] })
    ],
    'patch' : [
        { op : patchOps.moveChild, args : [nodeA, nodeD, true] },
        { op : patchOps.insertChild, args : [nodeE, nodeB] },
        { op : patchOps.moveChild, args : [nodeC, nodeD, true] },
        { op : patchOps.insertChild, args : [nodeF, nodeD] },
        { op : patchOps.insertChild, args : [nodeG, nodeD] },
        { op : patchOps.removeChild, args : [nodeD] }
    ]
};
