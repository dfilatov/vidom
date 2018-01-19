import patchOps from '../../../src/client/patchOps';
import { h } from '../../helpers';

const oldNode = h('div');

export default {
    'name' : 'removeChild1',
    'trees' : [
        h('div', { children : [
            h('div'),
            h('div'),
            oldNode
        ] }),
        h('div', { children : [
            h('div'),
            h('div')
        ] })
    ],
    'patch' : [
        { op : patchOps.removeChild, args : [oldNode] }
    ]
};
