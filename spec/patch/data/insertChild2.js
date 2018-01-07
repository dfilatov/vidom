import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const newNode = createElement('input').setKey('a'),
    beforeNode = createElement('input');

export default {
    'name' : 'insertChild2',
    'trees' : [
        createElement('div').setChildren([
            createElement('span'),
            createElement('input')
        ]),
        createElement('div').setChildren([
            createElement('span'),
            newNode,
            beforeNode
        ])
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [newNode, beforeNode] }
    ]
};
