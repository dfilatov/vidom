import patchOps from '../../../src/client/patchOps';
import { h } from '../../helpers';

const oldNode = h('div'),
    newNode = h('svg'),
    replaceOp = patchOps.replace;

export default {
    'name' : 'replace4',
    'trees' : [
        oldNode,
        newNode
    ],
    'patch' : [
        { op : replaceOp, args : [oldNode, newNode] }
    ]
};
