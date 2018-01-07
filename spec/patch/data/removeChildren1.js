import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const parentNode = createElement('div');

export default {
    'name' : 'removeChildren1',
    'trees' : [
        parentNode.setChildren([createElement('div'), createElement('div')]),
        createElement('div')
    ],
    'patch' : [
        { op : patchOps.removeChildren, args : [parentNode] }
    ]
};
