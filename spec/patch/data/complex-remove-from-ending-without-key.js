import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const nodeC = createNode('a'),
    nodeD = createNode('a');

export default {
    'name' : 'complex-remove-from-ending-without-key',
    'trees' : [
        createNode('div').setChildren([
            createNode('a').setKey('a'),
            createNode('a').setKey('b'),
            nodeC,
            nodeD
        ]),
        createNode('div').setChildren([
            createNode('a').setKey('a'),
            createNode('a').setKey('b')
        ])
    ],
    'patch' : [
        { op : patchOps.removeChild, args : [nodeC] },
        { op : patchOps.removeChild, args : [nodeD] }
    ]
};
