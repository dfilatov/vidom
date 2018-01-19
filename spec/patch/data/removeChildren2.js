import patchOps from '../../../src/client/patchOps';
import { h } from '../../helpers';

const parentNode = h('fragment', { children : [h('div'), h('div')] });

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
