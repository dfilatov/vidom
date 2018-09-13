import patchOps from '../../../src/client/patchOps';
import { h } from '../../../src/vidom';

const node1 = h('div'),
    node2 = h('span'),
    parentNode = h('div', null, node1, node2);

export default {
    'name' : 'appendChild2',
    'trees' : [
        h('div'),
        parentNode
    ],
    'patch' : [
        { op : patchOps.appendChild, args : [parentNode, node1] },
        { op : patchOps.appendChild, args : [parentNode, node2] }
    ]
};
