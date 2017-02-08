import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const nodeA = createNode('a').setKey('a'),
    nodeB = createNode('a').setKey('b'),
    nodeC = createNode('a').setKey('c'),
    nodeD = createNode('a').setKey('d'),
    nodeE = createNode('a').setKey('e'),
    nodeF = createNode('a').setKey('f'),
    nodeG = createNode('a').setKey('g');

export default {
    'name' : 'complex-shuffle-with-inserts-removes',
    'trees' : [
        createNode('div').setChildren([
            nodeA,
            nodeB,
            nodeC,
            nodeD
        ]),
        createNode('div').setChildren([
            nodeE,
            createNode('a').setKey('b'),
            nodeF,
            nodeG,
            createNode('a').setKey('c'),
            createNode('a').setKey('a')
        ])
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
