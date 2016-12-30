import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const nodeA = createNode('a'),
    nodeB = createNode('a');

export default {
    'name' : 'complex-remove-from-beginning-without-key',
    'trees' : [
        createNode('div').children([
            nodeA,
            nodeB,
            createNode('a').key('c'),
            createNode('a').key('d')
        ]),
        createNode('div').children([
            createNode('a').key('c'),
            createNode('a').key('d')
        ])
    ],
    'patch' : [
        { op : patchOps.removeChild, args : [nodeA] },
        { op : patchOps.removeChild, args : [nodeB] }
    ]
};
