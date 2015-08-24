import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const parentNode = createNode('div'),
    nodeA = createNode('a').key('a'),
    nodeB = createNode('a').key('b');

export default {
    'name' : 'complex-remove-from-beginning-with-key',
    'trees' : [
        createNode('div').children([
            nodeA,
            nodeB,
            createNode('a').key('c'),
            createNode('a').key('d')
        ]),
        parentNode.children([
            createNode('a').key('c'),
            createNode('a').key('d')
        ])
    ],
    'patch' : [
        { op : patchOps.removeChild, args : [parentNode, nodeA] },
        { op : patchOps.removeChild, args : [parentNode, nodeB] }
    ]
}
