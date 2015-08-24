import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const parentNode = createNode('div'),
    nodeC = createNode('a'),
    nodeD = createNode('a'),
    nodeE = createNode('a').key('e');

export default {
    'name' : 'complex-insert-to-middle-without-key',
    'trees' : [
        createNode('div').children([
            createNode('a').key('a'),
            createNode('a').key('b'),
            createNode('a').key('e')
        ]),
        parentNode.children([
            createNode('a').key('a'),
            createNode('a').key('b'),
            nodeC,
            nodeD,
            nodeE
        ])
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [parentNode, nodeC, nodeE] },
        { op : patchOps.insertChild, args : [parentNode, nodeD, nodeE] }
    ]
}
