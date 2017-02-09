import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const nodeB = createNode('a').setKey('b'),
    nodeC = createNode('a').setKey('c'),
    nodeD = createNode('a').setKey('d'),
    nodeE = createNode('a').setKey('e'),
    nodeF = createNode('a').setKey('f'),
    parentNode = createNode('div');

export default {
    'name' : 'complex2',
    'trees' : [
        createNode('div').setChildren([
            createNode('a').setKey('a'),
            nodeC,
            nodeE
        ]),
        parentNode.setChildren([
            createNode('a').setKey('a'),
            nodeB,
            createNode('a').setKey('c'),
            nodeD,
            createNode('a').setKey('e'),
            nodeF
        ])
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [nodeB, nodeC] },
        { op : patchOps.insertChild, args : [nodeD, nodeE] },
        { op : patchOps.appendChild, args : [parentNode, nodeF] }
    ]
};
