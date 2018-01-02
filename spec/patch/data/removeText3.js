import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const node = createElement('plaintext');

export default {
    'name' : 'removeText3',
    'trees' : [
        node.setChildren('text'),
        createElement('plaintext')
    ],
    'patch' : [
        { op : patchOps.removeText, args : [node] }
    ]
};
