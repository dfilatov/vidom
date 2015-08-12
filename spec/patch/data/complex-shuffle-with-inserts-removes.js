import createNode from '../../../lib/createNode';
import patchOps from '../../../lib/client/patchOps';

const nodeA = createNode('a').key('a'),
    nodeB = createNode('a').key('b'),
    nodeC = createNode('a').key('c'),
    nodeD = createNode('a').key('d'),
    nodeE = createNode('a').key('e'),
    nodeF = createNode('a').key('f'),
    nodeG = createNode('a').key('g'),
    parentNode = createNode('div');

export default {
    'name' : 'complex-shuffle-with-inserts-removes',
    'trees' : [
        parentNode.children([
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
        { op : patchOps.moveChild, args : [parentNode, nodeA, nodeD, true] },
        { op : patchOps.insertChild, args : [parentNode, nodeE, nodeB] },
        { op : patchOps.moveChild, args : [parentNode, nodeC, nodeD, true] },
        { op : patchOps.insertChild, args : [parentNode, nodeF, nodeD] },
        { op : patchOps.insertChild, args : [parentNode, nodeG, nodeD] },
        { op : patchOps.removeChild, args : [parentNode, nodeD] }
    ]
}
