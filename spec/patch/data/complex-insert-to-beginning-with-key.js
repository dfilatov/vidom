import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const nodeA = createNode('a').setKey('a'),
    nodeB = createNode('a').setKey('b'),
    nodeC = createNode('a').setKey('c');

export default {
    'name' : 'complex-insert-to-beginning-with-key',
    'trees' : [
        createNode('div').setChildren([
            createNode('a').setKey('c'),
            createNode('a').setKey('d')
        ]),
        createNode('div').setChildren([
            nodeA,
            nodeB,
            nodeC,
            createNode('a').setKey('d')
        ])
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [nodeA, nodeC] },
        { op : patchOps.insertChild, args : [nodeB, nodeC] }
    ]
};
