import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const nodeC = createNode('a'),
    nodeD = createNode('a'),
    parentNode = createNode('div');

export default {
    'name' : 'complex-insert-to-ending-without-key',
    'trees' : [
        createNode('div').children([
            createNode('a').key('a'),
            createNode('a').key('b')
        ]),
        parentNode.children([
            createNode('a').key('a'),
            createNode('a').key('b'),
            nodeC,
            nodeD
        ])
    ],
    'patch' : [
        { op : patchOps.appendChild, args : [parentNode, nodeC] },
        { op : patchOps.appendChild, args : [parentNode, nodeD] }
    ]
};
