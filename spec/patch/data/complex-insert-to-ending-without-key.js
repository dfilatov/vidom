import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const nodeC = createNode('a'),
    nodeD = createNode('a'),
    parentNode = createNode('div');

export default {
    'name' : 'complex-insert-to-ending-without-key',
    'trees' : [
        createNode('div').setChildren([
            createNode('a').setKey('a'),
            createNode('a').setKey('b')
        ]),
        parentNode.setChildren([
            createNode('a').setKey('a'),
            createNode('a').setKey('b'),
            nodeC,
            nodeD
        ])
    ],
    'patch' : [
        { op : patchOps.appendChild, args : [parentNode, nodeC] },
        { op : patchOps.appendChild, args : [parentNode, nodeD] }
    ]
};
