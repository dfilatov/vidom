import createNode from '../../../src/createNode';
import createComponent from '../../../src/createComponent';
import patchOps from '../../../src/client/patchOps';

const oldNode = createNode('div'),
    newNode = createNode(createComponent({
        onRender() {
            return createNode('div');
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
