import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const nodeA = createNode('a'),
    nodeB = createNode('a');

export default {
    'name' : 'complex-remove-from-beginning-without-key',
    'trees' : [
        createNode('div').setChildren([
            nodeA,
            nodeB,
            createNode('a').setKey('c'),
            createNode('a').setKey('d')
        ]),
        createNode('div').setChildren([
            createNode('a').setKey('c'),
            createNode('a').setKey('d')
        ])
    ],
    'patch' : [
        { op : patchOps.removeChild, args : [nodeA] },
        { op : patchOps.removeChild, args : [nodeB] }
    ]
};
