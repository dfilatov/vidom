import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const nodeC = createNode('a').key('c'),
    nodeD = createNode('a').key('d'),
    parentNode = createNode('div');

export default {
    'name' : 'complex-remove-from-ending-with-key',
    'trees' : [
        parentNode.children([
            createNode('a').key('a'),
            createNode('a').key('b'),
            nodeC,
            nodeD
        ]),
        createNode('div').children([
            createNode('a').key('a'),
            createNode('a').key('b')
        ])
    ],
    'patch' : [
        { op : patchOps.removeChild, args : [parentNode, nodeC] },
        { op : patchOps.removeChild, args : [parentNode, nodeD] }
    ]
}
