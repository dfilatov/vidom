import patchOps from '../../../src/client/patchOps';
import { h } from '../../helpers';

const oldNode = h('fragment'),
    newNode = h('div'),
    replaceOp = patchOps.replace;

export default {
    'name' : 'replace12',
    'trees' : [
        oldNode,
        newNode
    ],
    'patch' : [
        { op : replaceOp, args : [oldNode, newNode] }
    ]
};
