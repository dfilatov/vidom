import createComponent from '../../../src/createComponent';
import patchOps from '../../../src/client/patchOps';
import { h } from '../../../src/vidom';

const oldNode = h('div'),
    newNode = h(createComponent({
        onRender() {
            return h('div');
        }
    })),
    replaceOp = patchOps.replace;

export default {
    'name' : 'replace9',
    'trees' : [
        oldNode,
        newNode
    ],
    'patch' : [
        { op : replaceOp, args : [oldNode, newNode] }
    ]
};
