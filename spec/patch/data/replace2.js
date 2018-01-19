import patchOps from '../../../src/client/patchOps';
import { h } from '../../helpers';

const oldNode = h('div'),
    newNode = h('span');

export default {
    'name' : 'replace2',
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
