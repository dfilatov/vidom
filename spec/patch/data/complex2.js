import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const nodeB = createNode('a').key('b'),
    nodeC = createNode('a').key('c'),
    nodeD = createNode('a').key('d'),
    nodeE = createNode('a').key('e'),
    nodeF = createNode('a').key('f'),
    parentNode = createNode('div');

export default {
    'name' : 'complex2',
    'trees' : [
        createNode('div').children([
            createNode('a').key('a'),
            nodeC,
            nodeE
        ]),
        parentNode.children([
            createNode('a').key('a'),
            nodeB,
            createNode('a').key('c'),
            nodeD,
            createNode('a').key('e'),
            nodeF
        ])
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [nodeB, nodeC] },
        { op : patchOps.insertChild, args : [nodeD, nodeE] },
        { op : patchOps.appendChild, args : [parentNode, nodeF] }
    ]
}
