import createNode from '../../../src/createNode';
import createComponent from '../../../src/createComponent';
import patchOps from '../../../src/client/patchOps';

const C1 = () => createNode('div'),
    C2 = createComponent({
        onRender() {
            return createNode('div');
        }
    }),
    oldNode = createNode(C1),
    newNode = createNode(C2),
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
