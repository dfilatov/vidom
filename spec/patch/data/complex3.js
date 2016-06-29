import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const nodeA = createNode('a').key('a'),
    nodeB = createNode('a').key('b'),
    nodeC = createNode('a').key('c'),
    nodeD = createNode('a').key('d'),
    nodeE = createNode('a').key('e'),
    parentNode = createNode('div');

export default {
    'name' : 'complex3',
    'trees' : [
        createNode('div').children([
            nodeD,
            nodeB
        ]),
        parentNode.children([
            nodeA,
            createNode('a').key('b'),
            nodeC,
            createNode('a').key('d'),
            nodeE
        ])
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [nodeA, nodeD] },
        { op : patchOps.moveChild, args : [nodeB, nodeD, false] },
        { op : patchOps.insertChild, args : [nodeC, nodeD] },
        { op : patchOps.appendChild, args : [parentNode, nodeE] }
    ]
}
