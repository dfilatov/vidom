import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const oldNode = createElement('div');

export default {
    'name' : 'removeChild1',
    'trees' : [
        createElement('div').setChildren([
            createElement('div'),
            createElement('div'),
            oldNode
        ]),
        createElement('div').setChildren([
            createElement('div'),
            createElement('div')
        ])
    ],
    'patch' : [
        { op : patchOps.removeChild, args : [oldNode] }
    ]
};
