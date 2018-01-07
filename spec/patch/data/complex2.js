import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const nodeB = createElement('a').setKey('b'),
    nodeC = createElement('a').setKey('c'),
    nodeD = createElement('a').setKey('d'),
    nodeE = createElement('a').setKey('e'),
    nodeF = createElement('a').setKey('f'),
    parentNode = createElement('div');

export default {
    'name' : 'complex2',
    'trees' : [
        createElement('div').setChildren([
            createElement('a').setKey('a'),
            nodeC,
            nodeE
        ]),
        parentNode.setChildren([
            createElement('a').setKey('a'),
            nodeB,
            createElement('a').setKey('c'),
            nodeD,
            createElement('a').setKey('e'),
            nodeF
        ])
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [nodeB, nodeC] },
        { op : patchOps.insertChild, args : [nodeD, nodeE] },
        { op : patchOps.appendChild, args : [parentNode, nodeF] }
    ]
};
