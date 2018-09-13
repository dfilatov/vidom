import { h } from '../../../src/vidom';
import patchOps from '../../../src/client/patchOps';

const node = h('plaintext', null, 'text');

export default {
    'name' : 'removeText3',
    'trees' : [
        node,
        h('plaintext')
    ],
    'patch' : [
        { op : patchOps.removeText, args : [node] }
    ]
};
