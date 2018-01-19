import patchOps from '../../../src/client/patchOps';
import { h } from '../../helpers';

const nodeA = h('a', { key : 'a' }),
    nodeB = h('a', { key : 'b' }),
    nodeC = h('a', { key : 'c' }),
    nodeD = h('a', { key : 'd' }),
    nodeE = h('a', { key : 'e' }),
    parentNode = h('div', { children : [
        nodeA,
        h('a', { key : 'b' }),
        nodeC,
        h('a', { key : 'd' }),
        nodeE
    ] });

export default {
    'name' : 'complex3',
    'trees' : [
        h('div', { children : [
            nodeD,
            nodeB
        ] }),
        parentNode
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [nodeA, nodeD] },
        { op : patchOps.moveChild, args : [nodeB, nodeD, false] },
        { op : patchOps.insertChild, args : [nodeC, nodeD] },
        { op : patchOps.appendChild, args : [parentNode, nodeE] }
    ]
};
