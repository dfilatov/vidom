import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const nodeA = createNode('a').setKey('a'),
    nodeB = createNode('a').setKey('b'),
    nodeC = createNode('a').setKey('c'),
    nodeD = createNode('a').setKey('d');

export default {
    'name' : 'complex-reverse',
    'trees' : [
        createNode('div').setChildren([
            nodeA,
            nodeB,
            nodeC,
            nodeD
        ]),
        createNode('div').setChildren([
            createNode('a').setKey('d'),
            createNode('a').setKey('c'),
            createNode('a').setKey('b'),
            createNode('a').setKey('a')
        ])
    ],
    'patch' : [
        { op : patchOps.moveChild, args : [nodeA, nodeD, true] },
        { op : patchOps.moveChild, args : [nodeB, nodeD, true] },
        { op : patchOps.moveChild, args : [nodeC, nodeD, true] }
    ]
};
