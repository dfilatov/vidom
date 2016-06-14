import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const nodeA = createNode('input').key('a'),
    nodeB = createNode('input').key('b');

export default {
    'name' : 'moveChild2',
    'trees' : [
        createNode('fragment').children([
            nodeA,
            nodeB
        ]),
        createNode('fragment').children([
            createNode('input').key('b'),
            createNode('input').key('a')
        ])
    ],
    'patch' : [
        { op : patchOps.moveChild, args : [nodeA, nodeB, true] }
    ]
}
