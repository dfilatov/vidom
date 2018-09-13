import patchOps from '../../../src/client/patchOps';
import { h } from '../../../src/vidom';

const node = h('button', { value : 'text', className : 'button' });

export default {
    'name' : 'removeAttr2',
    'trees' : [
        node,
        h('button')
    ],
    'patch' : [
        { op : patchOps.removeAttr, args : [node, 'value'] },
        { op : patchOps.removeAttr, args : [node, 'className'] }
    ]
};
