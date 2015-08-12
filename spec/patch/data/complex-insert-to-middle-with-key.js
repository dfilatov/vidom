import createNode from '../../../lib/createNode';
import patchOps from '../../../lib/client/patchOps';

const parentNode = createNode('div'),
    nodeC = createNode('a').key('c'),
    nodeD = createNode('a').key('d'),
    nodeE = createNode('a').key('e');

export default {
    'name' : 'complex-insert-to-middle-with-key',
    'trees' : [
        parentNode.children([
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
        { op : patchOps.insertChild, args : [parentNode, nodeC, nodeE] },
        { op : patchOps.insertChild, args : [parentNode, nodeD, nodeE] }
    ]
}
