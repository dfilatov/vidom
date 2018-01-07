import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const newNode = createElement('input').setKey('b'),
    nodeC = createElement('input').setKey('c');

export default {
    'name' : 'insertChild1',
    'trees' : [
        createElement('div').setChildren([
            createElement('input').setKey('a'),
            createElement('input').setKey('c')
        ]),
        createElement('div').setChildren([
            createElement('input').setKey('a'),
            newNode,
            nodeC
        ])
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [newNode, nodeC] }
    ]
};
