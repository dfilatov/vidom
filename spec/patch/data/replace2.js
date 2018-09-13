import patchOps from '../../../src/client/patchOps';
import { h } from '../../../src/vidom';

const oldNode = h('div'),
    newNode = h('span');

export default {
    'name' : 'replace2',
    'trees' : [
        h('div', null, h('div'), oldNode),
        h('div', null, h('div'), newNode)
    ],
    'patch' : [
        { op : patchOps.replace, args : [oldNode, newNode] }
    ]
};
