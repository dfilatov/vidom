import createNode from '../../../lib/createNode';
import patchOps from '../../../lib/client/patchOps';

const parentNode = createNode('div'),
    nodeA = createNode('input').key('a'),
    nodeB = createNode('input').key('b');

export default {
    'name' : 'moveChild1',
    'trees' : [
        parentNode.children([
            nodeA,
            nodeB
        ]),
        createNode('div').children([
            createNode('input').key('b'),
            createNode('input').key('a')
        ])
    ],
    'patch' : [
        { op : patchOps.moveChild, args : [parentNode, nodeA, nodeB, true] }
    ]
}
