import patchOps from '../../../src/client/patchOps';
import { h } from '../../../src/vidom';

const newNode = h('input', { key : 'a' }),
    beforeNode = h('input');

export default {
    'name' : 'insertChild2',
    'trees' : [
        h('div', null, h('span'), h('input')),
        h('div', null, h('span'), newNode, beforeNode)
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [newNode, beforeNode] }
    ]
};
