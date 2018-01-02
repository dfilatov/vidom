import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const nodeA = createElement('a').setKey('a'),
    nodeB = createElement('a').setKey('b'),
    nodeC = createElement('a').setKey('c'),
    nodeD = createElement('a').setKey('d'),
    nodeE = createElement('a').setKey('e'),
    parentNode = createElement('div');

export default {
    'name' : 'complex3',
    'trees' : [
        createElement('div').setChildren([
            nodeD,
            nodeB
        ]),
        parentNode.setChildren([
            nodeA,
            createElement('a').setKey('b'),
            nodeC,
            createElement('a').setKey('d'),
            nodeE
        ])
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [nodeA, nodeD] },
        { op : patchOps.moveChild, args : [nodeB, nodeD, false] },
        { op : patchOps.insertChild, args : [nodeC, nodeD] },
        { op : patchOps.appendChild, args : [parentNode, nodeE] }
    ]
};
