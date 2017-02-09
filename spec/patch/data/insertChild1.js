import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const newNode = createNode('input').setKey('b'),
    nodeC = createNode('input').setKey('c');

export default {
    'name' : 'insertChild1',
    'trees' : [
        createNode('div').setChildren([
            createNode('input').setKey('a'),
            createNode('input').setKey('c')
        ]),
        createNode('div').setChildren([
            createNode('input').setKey('a'),
            newNode,
            nodeC
        ])
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [newNode, nodeC] }
    ]
};
