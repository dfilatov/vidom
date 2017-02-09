import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const nodeA = createNode('a').setKey('a'),
    nodeB = createNode('a').setKey('b'),
    nodeC = createNode('a').setKey('c'),
    nodeD = createNode('a').setKey('d');

export default {
    'name' : 'complex1',
    'trees' : [
        createNode('div').setChildren([
            nodeC,
            nodeA.setChildren(createNode('div')),
            nodeD
        ]),
        createNode('div').setChildren([
            nodeB,
            createNode('a').setKey('a').setChildren('new text')
        ])
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [nodeB, nodeC] },
        { op : patchOps.moveChild, args : [nodeA, nodeC, false] },
        { op : patchOps.removeChildren, args : [nodeA] },
        { op : patchOps.updateText, args : [nodeA, 'new text', true] },
        { op : patchOps.removeChild, args : [nodeC] },
        { op : patchOps.removeChild, args : [nodeD] }
    ]
};
