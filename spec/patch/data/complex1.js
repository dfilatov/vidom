import patchOps from '../../../src/client/patchOps';
import { h } from '../../helpers';

const nodeA = h('a', { key : 'a', children : h('div') }),
    nodeB = h('a', { key : 'b' }),
    nodeC = h('a', { key : 'c' }),
    nodeD = h('a', { key : 'd' });

export default {
    'name' : 'complex1',
    'trees' : [
        h('div', { children : [
            nodeC,
            nodeA,
            nodeD
        ] }),
        h('div', { children : [
            nodeB,
            h('a', { key : 'a', children : 'new text' })
        ] })
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [nodeB, nodeC] },
        { op : patchOps.moveChild, args : [nodeA, nodeC, false] },
        { op : patchOps.removeChildren, args : [nodeA] },
        { op : patchOps.updateText, args : [nodeA, 'new text', true] },
        { op : patchOps.removeChild, args : [nodeC] },
        { op : patchOps.removeChild, args : [nodeD] }
    ]
};
