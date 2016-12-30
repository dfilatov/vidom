import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const nodeA = createNode('a').key('a'),
    nodeB = createNode('a').key('b'),
    nodeC = createNode('a').key('c'),
    nodeD = createNode('a').key('d'),
    nodeE = createNode('a').key('e'),
    nodeF = createNode('a').key('f'),
    nodeG = createNode('a').key('g');

export default {
    'name' : 'complex-shuffle-with-inserts-removes',
    'trees' : [
        createNode('div').children([
            nodeA,
            nodeB,
            nodeC,
            nodeD
        ]),
        createNode('div').children([
            nodeE,
            createNode('a').key('b'),
            nodeF,
            nodeG,
            createNode('a').key('c'),
            createNode('a').key('a')
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
