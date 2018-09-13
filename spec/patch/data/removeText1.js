import patchOps from '../../../src/client/patchOps';
import { h } from '../../../src/vidom';

const node = h('a', null, 'text');

export default {
    'name' : 'removeText1',
    'trees' : [
        node,
        h('a')
    ],
    'patch' : [
        { op : patchOps.removeText, args : [node] }
    ]
};
