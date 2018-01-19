import patchOps from '../../../src/client/patchOps';
import { h } from '../../helpers';

const nodeC = h('a', { key : 'c' }),
    nodeD = h('a', { key : 'd' });

export default {
    'name' : 'complex-remove-from-ending-with-key',
    'trees' : [
        h('div', { children : [
            h('a', { key : 'a' }),
            h('a', { key : 'b' }),
            nodeC,
            nodeD
        ] }),
        h('div', { children : [
            h('a', { key : 'a' }),
            h('a', { key : 'b' })
        ] })
    ],
    'patch' : [
        { op : patchOps.removeChild, args : [nodeC] },
        { op : patchOps.removeChild, args : [nodeD] }
    ]
};
