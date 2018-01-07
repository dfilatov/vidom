import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const parentNode = createElement('fragment');

export default {
    'name' : 'removeChildren2',
    'trees' : [
        parentNode.setChildren([createElement('div'), createElement('div')]),
        createElement('fragment')
    ],
    'patch' : [
        { op : patchOps.removeChildren, args : [parentNode] }
    ]
};
