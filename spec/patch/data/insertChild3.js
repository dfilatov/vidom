import patchOps from '../../../src/client/patchOps';
import { h } from '../../helpers';

const newNode = h('input', { key : 'a' }),
    beforeNode = h('input');

export default {
    'name' : 'insertChild3',
    'trees' : [
        h('fragment', { children : [
            h('span'),
            h('input')
        ] }),
        h('fragment', { children : [
            h('span'),
            newNode,
            beforeNode
        ] })
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [newNode, beforeNode] }
    ]
};
