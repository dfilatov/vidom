import patchOps from '../../../src/client/patchOps';
import { h } from '../../../src/vidom';

const oldNode = h('div');

export default {
    'name' : 'removeChild2',
    'trees' : [
        h('fragment', null, h('div'), h('div'), oldNode),
        h('fragment', null, h('div'), h('div'))
    ],
    'patch' : [
        { op : patchOps.removeChild, args : [oldNode] }
    ]
};
