import { h } from '../../../src/vidom';
import patchOps from '../../../src/client/patchOps';

const node = h('div', { id : 'id1' });

export default {
    'name' : 'updateAttr1',
    'trees' : [
        node,
        h('div', { id : 'id2' })
    ],
    'patch' : [
        { op : patchOps.updateAttr, args : [node, 'id', 'id2'] }
    ]
};
