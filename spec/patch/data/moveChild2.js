import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const nodeA = createElement('input').setKey('a'),
    nodeB = createElement('input').setKey('b');

export default {
    'name' : 'moveChild2',
    'trees' : [
        createElement('fragment').setChildren([
            nodeA,
            nodeB
        ]),
        createElement('fragment').setChildren([
            createElement('input').setKey('b'),
            createElement('input').setKey('a')
        ])
    ],
    'patch' : [
        { op : patchOps.moveChild, args : [nodeA, nodeB, true] }
    ]
};
