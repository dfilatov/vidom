import { h } from '../../../src/vidom';
import patchOps from '../../../src/client/patchOps';

const node = h('plaintext', null, 'text');

export default {
    'name' : 'updateText4',
    'trees' : [
        node,
        h('plaintext', null, 'new text')
    ],
    'patch' : [
        { op : patchOps.updateText, args : [node, 'new text', false] }
    ]
};
