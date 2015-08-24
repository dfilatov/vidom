import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const newNode = createNode('input').key('b'),
    nodeC = createNode('input').key('c'),
    parentNode = createNode('div');

export default {
    'name' : 'insertChild1',
    'trees' : [
        createNode('div').children([
            createNode('input').key('a'),
            createNode('input').key('c')
        ]),
        parentNode.children([
            createNode('input').key('a'),
            newNode,
            nodeC
        ])
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [parentNode, newNode, nodeC] }
    ]
}
