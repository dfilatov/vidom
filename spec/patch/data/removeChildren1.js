import patchOps from '../../../src/client/patchOps';
import { h } from '../../../src/vidom';

const parentNode = h('div', null, h('div'), h('div'));

export default {
    'name' : 'removeChildren1',
    'trees' : [
        parentNode,
        h('div')
    ],
    'patch' : [
        { op : patchOps.removeChildren, args : [parentNode] }
    ]
};
