import createNode from '../../../lib/createNode';
import patchOps from '../../../lib/client/patchOps';

const newNode = createNode('input').key('b'),
    nodeC = createNode('input').key('c'),
    parentNode = createNode('div');

export default {
    'name' : 'insertChild1',
    'trees' : [
        parentNode.children([
            createNode('input').key('a'),
            nodeC
        ]),
        createNode('div').children([
            createNode('input').key('a'),
            newNode,
            createNode('input').key('c')
        ])
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [parentNode, newNode, nodeC] }
    ]
}
