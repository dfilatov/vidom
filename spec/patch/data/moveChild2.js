import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const nodeA = createNode('input').setKey('a'),
    nodeB = createNode('input').setKey('b');

export default {
    'name' : 'moveChild2',
    'trees' : [
        createNode('fragment').setChildren([
            nodeA,
            nodeB
        ]),
        createNode('fragment').setChildren([
            createNode('input').setKey('b'),
            createNode('input').setKey('a')
        ])
    ],
    'patch' : [
        { op : patchOps.moveChild, args : [nodeA, nodeB, true] }
    ]
};
