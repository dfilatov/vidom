import patchOps from '../../../src/client/patchOps';
import { h } from '../../helpers';

const nodeA = h('input', { key : 'a' }),
    nodeB = h('input', { key : 'b' });

export default {
    'name' : 'moveChild1',
    'trees' : [
        h('div', { children : [
            nodeA,
            nodeB
        ] }),
        h('div', { children : [
            h('input', { key : 'b' }),
            h('input', { key : 'a' })
        ] })
    ],
    'patch' : [
        { op : patchOps.moveChild, args : [nodeA, nodeB, true] }
    ]
};
