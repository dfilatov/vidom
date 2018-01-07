import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const node = createElement('plaintext').setChildren('text');

export default {
    'name' : 'updateText4',
    'trees' : [
        node,
        createElement('plaintext').setChildren('new text')
    ],
    'patch' : [
        { op : patchOps.updateText, args : [node, 'new text', false] }
    ]
};
