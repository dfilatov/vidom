import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const nodeA = createElement('a').setKey('a'),
    nodeB = createElement('a').setKey('b'),
    nodeC = createElement('a').setKey('c'),
    nodeD = createElement('a').setKey('d'),
    nodeE = createElement('a').setKey('e'),
    nodeF = createElement('a').setKey('f'),
    nodeG = createElement('a').setKey('g');

export default {
    'name' : 'complex-shuffle-with-inserts-removes',
    'trees' : [
        createElement('div').setChildren([
            nodeA,
            nodeB,
            nodeC,
            nodeD
        ]),
        createElement('div').setChildren([
            nodeE,
            createElement('a').setKey('b'),
            nodeF,
            nodeG,
            createElement('a').setKey('c'),
            createElement('a').setKey('a')
        ])
    ],
    'patch' : [
        { op : patchOps.moveChild, args : [nodeA, nodeD, true] },
        { op : patchOps.insertChild, args : [nodeE, nodeB] },
        { op : patchOps.moveChild, args : [nodeC, nodeD, true] },
        { op : patchOps.insertChild, args : [nodeF, nodeD] },
        { op : patchOps.insertChild, args : [nodeG, nodeD] },
        { op : patchOps.removeChild, args : [nodeD] }
    ]
};
