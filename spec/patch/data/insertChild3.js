import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const newNode = createNode('input').setKey('a'),
    beforeNode = createNode('input');

export default {
    'name' : 'insertChild3',
    'trees' : [
        createNode('fragment').setChildren([
            createNode('span'),
            createNode('input')
        ]),
        createNode('fragment').setChildren([
            createNode('span'),
            newNode,
            beforeNode
        ])
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [newNode, beforeNode] }
    ]
};
