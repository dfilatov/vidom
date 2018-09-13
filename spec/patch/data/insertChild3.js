import patchOps from '../../../src/client/patchOps';
import { h } from '../../../src/vidom';

const newNode = h('input', { key : 'a' }),
    beforeNode = h('input');

export default {
    'name' : 'insertChild3',
    'trees' : [
        h('fragment', null, h('span'), h('input')),
        h('fragment', null, h('span'), newNode, beforeNode)
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [newNode, beforeNode] }
    ]
};
