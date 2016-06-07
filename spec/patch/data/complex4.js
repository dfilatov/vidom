import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const nodeB = createNode('fragment').key('b'),
    nodeC = createNode('a').key('c'),
    nodeBA = createNode('fragment').key('ba'),
    nodeBAA = createNode('b').key('baa'),
    nodeBAB = createNode('b').key('bab'),
    nodeBB = createNode('a').key('bb'),
    nodeD = createNode('a').key('d'),
    parentNode = createNode('fragment');

export default {
    'name' : 'complex4',
    'trees' : [
        createNode('fragment').children([
            createNode('a').key('a'),
            nodeB.children([
                nodeBA.children([
                    nodeBAA,
                    nodeBAB
                ]),
                nodeBB
            ]),
            nodeC,
            nodeD
        ]),
        parentNode.children([
            createNode('a').key('a'),
            createNode('a').key('c'),
            createNode('fragment').key('b').children([
                createNode('a').key('bb'),
                createNode('fragment').key('ba').children([
                    createNode('b').key('bab'),
                    createNode('b').key('baa')
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
}
