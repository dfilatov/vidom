import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const nodeC = createNode('a'),
    nodeD = createNode('a'),
    nodeE = createNode('a').setKey('e');

export default {
    'name' : 'complex-insert-to-middle-without-key',
    'trees' : [
        createNode('div').setChildren([
            createNode('a').setKey('a'),
            createNode('a').setKey('b'),
            createNode('a').setKey('e')
        ]),
        createNode('div').setChildren([
            createNode('a').setKey('a'),
            createNode('a').setKey('b'),
            nodeC,
            nodeD,
            nodeE
        ])
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [nodeC, nodeE] },
        { op : patchOps.insertChild, args : [nodeD, nodeE] }
    ]
};
