import patchOps from '../../../src/client/patchOps';
import { h } from '../../helpers';

const nodeA = h('a'),
    nodeB = h('a'),
    nodeC = h('a', { key : 'c' });

export default {
    'name' : 'complex-insert-to-beginning-without-key',
    'trees' : [
        h('div', { children : [
            h('a', { key : 'c' }),
            h('a', { key : 'd' })
        ] }),
        h('div', { children : [
            nodeA,
            nodeB,
            nodeC,
            h('a', { key : 'd' })
        ] })
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [nodeA, nodeC] },
        { op : patchOps.insertChild, args : [nodeB, nodeC] }
    ]
};
