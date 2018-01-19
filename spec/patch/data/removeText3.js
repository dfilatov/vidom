import { h } from '../../helpers';
import patchOps from '../../../src/client/patchOps';

const node = h('plaintext', { children : 'text' });

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
