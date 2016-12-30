import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const nodeA = createNode('a'),
    nodeB = createNode('a'),
    nodeC = createNode('a').key('c');

export default {
    'name' : 'complex-insert-to-beginning-without-key',
    'trees' : [
        createNode('div').children([
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
        { op : patchOps.insertChild, args : [nodeA, nodeC] },
        { op : patchOps.insertChild, args : [nodeB, nodeC] }
    ]
};
