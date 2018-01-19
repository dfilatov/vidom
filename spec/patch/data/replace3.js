import patchOps from '../../../src/client/patchOps';
import { h } from '../../helpers';

const oldNode = h('div', { key : 'a' }),
    newNode = h('span', { key : 'a' });

export default {
    'name' : 'replace3',
    'trees' : [
        h('div', { children : [
            h('div'),
            oldNode
        ] }),
        h('div', { children : [
            h('div'),
            newNode
        ] })
    ],
    'patch' : [
        { op : patchOps.replace, args : [oldNode, newNode] }
    ]
};
