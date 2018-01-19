import patchOps from '../../../src/client/patchOps';
import { h } from '../../helpers';

const nodeA = h('a'),
    nodeB = h('a');

export default {
    'name' : 'complex-remove-from-beginning-without-key',
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
