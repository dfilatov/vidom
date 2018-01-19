import patchOps from '../../../src/client/patchOps';
import { h } from '../../helpers';

const nodeC = h('a', { key : 'c' }),
    nodeD = h('a', { key : 'd' }),
    nodeE = h('a', { key : 'e' });

export default {
    'name' : 'complex-insert-to-middle-with-key',
    'trees' : [
        h('div', { children : [
            h('a', { key : 'a' }),
            h('a', { key : 'b' }),
            h('a', { key : 'e' })
        ] }),
        h('div', { children : [
            h('a', { key : 'a' }),
            h('a', { key : 'b' }),
            nodeC,
            nodeD,
            nodeE
        ] })
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [nodeC, nodeE] },
        { op : patchOps.insertChild, args : [nodeD, nodeE] }
    ]
};
