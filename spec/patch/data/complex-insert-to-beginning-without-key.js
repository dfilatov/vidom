import createNode from '../../../lib/createNode';
import patchOps from '../../../lib/client/patchOps';

const nodeA = createNode('a'),
    nodeB = createNode('a'),
    nodeC = createNode('a').key('c'),
    parentNode = createNode('div');

export default {
    'name' : 'complex-insert-to-beginning-without-key',
    'trees' : [
        parentNode.children([
            createNode('a').key('c'),
            createNode('a').key('d')
        ]),
        createNode('div').children([
            nodeA,
            nodeB,
            nodeC,
            createNode('a').key('d')
        ])
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [parentNode, nodeA, nodeC] },
        { op : patchOps.insertChild, args : [parentNode, nodeB, nodeC] }
    ]
}
