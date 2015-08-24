import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const parentNode = createNode('div'),
    nodeA = createNode('input').key('a'),
    nodeB = createNode('input').key('b');

export default {
    'name' : 'moveChild1',
    'trees' : [
        createNode('div').children([
            nodeA,
            nodeB
        ]),
        parentNode.children([
            createNode('input').key('b'),
            createNode('input').key('a')
        ])
    ],
    'patch' : [
        { op : patchOps.moveChild, args : [parentNode, nodeA, nodeB, true] }
    ]
}
