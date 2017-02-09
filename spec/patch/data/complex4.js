import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const nodeB = createNode('fragment').setKey('b'),
    nodeC = createNode('a').setKey('c'),
    nodeBA = createNode('fragment').setKey('ba'),
    nodeBAA = createNode('b').setKey('baa'),
    nodeBAB = createNode('b').setKey('bab'),
    nodeBB = createNode('a').setKey('bb'),
    nodeD = createNode('a').setKey('d'),
    parentNode = createNode('fragment');

export default {
    'name' : 'complex4',
    'trees' : [
        createNode('fragment').setChildren([
            createNode('a').setKey('a'),
            nodeB.setChildren([
                nodeBA.setChildren([
                    nodeBAA,
                    nodeBAB
                ]),
                nodeBB
            ]),
            nodeC,
            nodeD
        ]),
        parentNode.setChildren([
            createNode('a').setKey('a'),
            createNode('a').setKey('c'),
            createNode('fragment').setKey('b').setChildren([
                createNode('a').setKey('bb'),
                createNode('fragment').setKey('ba').setChildren([
                    createNode('b').setKey('bab'),
                    createNode('b').setKey('baa')
                ])
            ])
        ])
    ],
    'patch' : [
        { op : patchOps.moveChild, args : [nodeB, nodeD, true] },
        { op : patchOps.moveChild, args : [nodeBA, nodeBB, true] },
        { op : patchOps.moveChild, args : [nodeBAA, nodeBAB, true] },
        { op : patchOps.removeChild, args : [nodeD] }
    ]
};
