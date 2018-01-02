import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const nodeA = createElement('input').setKey('a'),
    nodeB = createElement('input').setKey('b');

export default {
    'name' : 'moveChild1',
    'trees' : [
        createElement('div').setChildren([
            nodeA,
            nodeB
        ]),
        createElement('div').setChildren([
            createElement('input').setKey('b'),
            createElement('input').setKey('a')
        ])
    ],
    'patch' : [
        { op : patchOps.moveChild, args : [nodeA, nodeB, true] }
    ]
};
