import patchOps from '../../../src/client/patchOps';
import { h } from '../../helpers';

const nodeC = h('a', { key : 'c' }),
    nodeD = h('a', { key : 'd' }),
    parentNode = h('div', { children : [
        h('a', { key : 'a' }),
        h('a', { key : 'b' }),
        nodeC,
        nodeD
    ] });

export default {
    'name' : 'complex-insert-to-ending-with-key',
    'trees' : [
        h('div', { children : [
            h('a', { key : 'a' }),
            h('a', { key : 'b' })
        ] }),
        parentNode
    ],
    'patch' : [
        { op : patchOps.appendChild, args : [parentNode, nodeC] },
        { op : patchOps.appendChild, args : [parentNode, nodeD] }
    ]
};
