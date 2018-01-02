import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const oldNode = createElement('div'),
    newNode = createElement('span');

export default {
    'name' : 'replace2',
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
