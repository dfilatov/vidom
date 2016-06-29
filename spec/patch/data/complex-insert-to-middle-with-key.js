import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const nodeC = createNode('a').key('c'),
    nodeD = createNode('a').key('d'),
    nodeE = createNode('a').key('e');

export default {
    'name' : 'complex-insert-to-middle-with-key',
    'trees' : [
        createNode('div').children([
            createNode('a').key('a'),
            createNode('a').key('b'),
            createNode('a').key('e')
        ]),
        createNode('div').children([
            createNode('a').key('a'),
            createNode('a').key('b'),
            nodeC,
            nodeD,
            nodeE
        ])
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [nodeC, nodeE] },
        { op : patchOps.insertChild, args : [nodeD, nodeE] }
    ]
}
