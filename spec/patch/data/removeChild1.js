import patchOps from '../../../src/client/patchOps';
import { h } from '../../../src/vidom';

const oldNode = h('div');

export default {
    'name' : 'removeChild1',
    'trees' : [
        h('div', null, h('div'), h('div'), oldNode),
        h('div', null, h('div'), h('div'))
    ],
    'patch' : [
        { op : patchOps.removeChild, args : [oldNode] }
    ]
};
