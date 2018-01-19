import patchOps from '../../../src/client/patchOps';
import { h } from '../../helpers';

const nodeA = h('a', { key : 'a' }),
    nodeB = h('a', { key : 'b' });

export default {
    'name' : 'complex-remove-from-beginning-with-key',
    'trees' : [
        h('div', { children : [
            nodeA,
            nodeB,
            h('a', { key : 'c' }),
            h('a', { key : 'd' })
        ] }),
        h('div', { children : [
            h('a', { key : 'c' }),
            h('a', { key : 'd' })
        ] })
    ],
    'patch' : [
        { op : patchOps.removeChild, args : [nodeA] },
        { op : patchOps.removeChild, args : [nodeB] }
    ]
};
