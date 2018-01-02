import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const oldNode = createElement('div');

export default {
    'name' : 'removeChild2',
    'trees' : [
        createElement('fragment').setChildren([
            createElement('div'),
            createElement('div'),
            oldNode
        ]),
        createElement('fragment').setChildren([
            createElement('div'),
            createElement('div')
        ])
    ],
    'patch' : [
        { op : patchOps.removeChild, args : [oldNode] }
    ]
};
