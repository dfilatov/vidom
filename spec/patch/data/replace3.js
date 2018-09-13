import patchOps from '../../../src/client/patchOps';
import { h } from '../../../src/vidom';

const oldNode = h('div', { key : 'a' }),
    newNode = h('span', { key : 'a' });

export default {
    'name' : 'replace3',
    'trees' : [
        h('div', null, h('div'), oldNode),
        h('div', null, h('div'), newNode)
    ],
    'patch' : [
        { op : patchOps.replace, args : [oldNode, newNode] }
    ]
};
