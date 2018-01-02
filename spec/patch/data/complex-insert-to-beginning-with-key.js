import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const nodeA = createElement('a').setKey('a'),
    nodeB = createElement('a').setKey('b'),
    nodeC = createElement('a').setKey('c');

export default {
    'name' : 'complex-insert-to-beginning-with-key',
    'trees' : [
        createElement('div').setChildren([
            createElement('a').setKey('c'),
            createElement('a').setKey('d')
        ]),
        createElement('div').setChildren([
            nodeA,
            nodeB,
            nodeC,
            createElement('a').setKey('d')
        ])
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [nodeA, nodeC] },
        { op : patchOps.insertChild, args : [nodeB, nodeC] }
    ]
};
