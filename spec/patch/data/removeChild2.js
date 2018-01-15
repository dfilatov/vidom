import patchOps from '../../../src/client/patchOps';
import { h } from '../../helpers';

const oldNode = h('div');

export default {
    'name' : 'removeChild2',
    'trees' : [
        h('fragment', { children : [
            h('div'),
            h('div'),
            oldNode
        ] }),
        h('fragment', { children : [
            h('div'),
            h('div')
        ] })
    ],
    'patch' : [
        { op : patchOps.removeChild, args : [oldNode] }
    ]
};
