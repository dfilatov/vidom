import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const nodeA = createNode('a').setKey('a'),
    nodeB = createNode('a').setKey('b'),
    nodeC = createNode('a').setKey('c'),
    nodeD = createNode('a').setKey('d'),
    nodeE = createNode('a').setKey('e'),
    parentNode = createNode('div');

export default {
    'name' : 'complex3',
    'trees' : [
        createNode('div').setChildren([
            nodeD,
            nodeB
        ]),
        parentNode.setChildren([
            nodeA,
            createNode('a').setKey('b'),
            nodeC,
            createNode('a').setKey('d'),
            nodeE
        ])
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [nodeA, nodeD] },
        { op : patchOps.moveChild, args : [nodeB, nodeD, false] },
        { op : patchOps.insertChild, args : [nodeC, nodeD] },
        { op : patchOps.appendChild, args : [parentNode, nodeE] }
    ]
};
