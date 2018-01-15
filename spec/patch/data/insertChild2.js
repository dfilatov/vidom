import patchOps from '../../../src/client/patchOps';
import { h } from '../../helpers';

const newNode = h('input', { key : 'a' }),
    beforeNode = h('input');

export default {
    'name' : 'insertChild2',
    'trees' : [
        h('div', { children : [
            h('span'),
            h('input')
        ] }),
        h('div', { children : [
            h('span'),
            newNode,
            beforeNode
        ] })
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [newNode, beforeNode] }
    ]
};
