import patchOps from '../../../src/client/patchOps';
import { h } from '../../helpers';

const node1 = h('div'),
    node2 = h('span'),
    parentNode = h('fragment', { children : [node1, node2] });

export default {
    'name' : 'appendChild3',
    'trees' : [
        h('fragment'),
        parentNode
    ],
    'patch' : [
        { op : patchOps.appendChild, args : [parentNode, node1] },
        { op : patchOps.appendChild, args : [parentNode, node2] }
    ]
};
