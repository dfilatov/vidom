import patchOps from '../../../src/client/patchOps';
import { h } from '../../../src/vidom';

const parentNode = h('fragment', null, h('div'), h('div'));

export default {
    'name' : 'removeChildren2',
    'trees' : [
        parentNode,
        h('fragment')
    ],
    'patch' : [
        { op : patchOps.removeChildren, args : [parentNode] }
    ]
};
