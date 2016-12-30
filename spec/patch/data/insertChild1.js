import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const newNode = createNode('input').key('b'),
    nodeC = createNode('input').key('c');

export default {
    'name' : 'insertChild1',
    'trees' : [
        createNode('div').children([
            createNode('input').key('a'),
            createNode('input').key('c')
        ]),
        createNode('div').children([
            createNode('input').key('a'),
            newNode,
            nodeC
        ])
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [newNode, nodeC] }
    ]
};
