import { h } from '../../helpers';
import patchOps from '../../../src/client/patchOps';

const node = h('plaintext', { children : 'text' });

export default {
    'name' : 'updateText4',
    'trees' : [
        node,
        h('plaintext', { children : 'new text' })
    ],
    'patch' : [
        { op : patchOps.updateText, args : [node, 'new text', false] }
    ]
};
