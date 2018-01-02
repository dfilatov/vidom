import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const nodeA = createElement('a'),
    nodeB = createElement('a'),
    nodeC = createElement('a').setKey('c');

export default {
    'name' : 'complex-insert-to-beginning-without-key',
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
