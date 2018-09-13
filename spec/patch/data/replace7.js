import createComponent from '../../../src/createComponent';
import patchOps from '../../../src/client/patchOps';
import { h } from '../../../src/vidom';

const C1 = () => h('div'),
    C2 = createComponent({
        onRender() {
            return h('div');
        }
    }),
    oldNode = h(C1),
    newNode = h(C2),
    replaceOp = patchOps.replace;

export default {
    'name' : 'replace7',
    'trees' : [
        oldNode,
        newNode
    ],
    'patch' : [
        { op : replaceOp, args : [oldNode, newNode] }
    ]
};
