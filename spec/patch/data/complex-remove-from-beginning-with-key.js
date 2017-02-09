import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const nodeA = createNode('a').setKey('a'),
    nodeB = createNode('a').setKey('b');

export default {
    'name' : 'complex-remove-from-beginning-with-key',
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
