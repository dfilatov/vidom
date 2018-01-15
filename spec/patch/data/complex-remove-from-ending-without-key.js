import patchOps from '../../../src/client/patchOps';
import { h } from '../../helpers';

const nodeC = h('a'),
    nodeD = h('a');

export default {
    'name' : 'complex-remove-from-ending-without-key',
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
