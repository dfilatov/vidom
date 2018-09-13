import patchOps from '../../../src/client/patchOps';
import { h } from '../../../src/vidom';

const node = h('button', { value : 'text' });

export default {
    'name' : 'updateAttr2',
    'trees' : [
        node,
        h('button', { value : 'text', disabled : true })
    ],
    'patch' : [
        { op : patchOps.updateAttr, args : [node, 'disabled', true] }
    ]
};
