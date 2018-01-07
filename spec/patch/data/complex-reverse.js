import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const nodeA = createElement('a').setKey('a'),
    nodeB = createElement('a').setKey('b'),
    nodeC = createElement('a').setKey('c'),
    nodeD = createElement('a').setKey('d');

export default {
    'name' : 'complex-reverse',
    'trees' : [
        createElement('div').setChildren([
            nodeA,
            nodeB,
            nodeC,
            nodeD
        ]),
        createElement('div').setChildren([
            createElement('a').setKey('d'),
            createElement('a').setKey('c'),
            createElement('a').setKey('b'),
            createElement('a').setKey('a')
        ])
    ],
    'patch' : [
        { op : patchOps.moveChild, args : [nodeA, nodeD, true] },
        { op : patchOps.moveChild, args : [nodeB, nodeD, true] },
        { op : patchOps.moveChild, args : [nodeC, nodeD, true] }
    ]
};
