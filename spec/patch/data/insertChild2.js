import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const newNode = createNode('input').setKey('a'),
    beforeNode = createNode('input');

export default {
    'name' : 'insertChild2',
    'trees' : [
        createNode('div').setChildren([
            createNode('span'),
            createNode('input')
        ]),
        createNode('div').setChildren([
            createNode('span'),
            newNode,
            beforeNode
        ])
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [newNode, beforeNode] }
    ]
};
