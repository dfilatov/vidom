import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const newNode = createNode('input').key('a'),
    beforeNode = createNode('input');

export default {
    'name' : 'insertChild2',
    'trees' : [
        createNode('div').children([
            createNode('span'),
            createNode('input')
        ]),
        createNode('div').children([
            createNode('span'),
            newNode,
            beforeNode
        ])
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [newNode, beforeNode] }
    ]
};
