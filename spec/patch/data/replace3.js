import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const oldNode = createElement('div').setKey('a'),
    newNode = createElement('span').setKey('a');

export default {
    'name' : 'replace3',
    'trees' : [
        createElement('div').setChildren([
            createElement('div'),
            oldNode
        ]),
        createElement('div').setChildren([
            createElement('div'),
            newNode
        ])
    ],
    'patch' : [
        { op : patchOps.replace, args : [oldNode, newNode] }
    ]
};
