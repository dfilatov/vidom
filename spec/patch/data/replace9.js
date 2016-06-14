import createNode from '../../../src/createNode';
import createComponent from '../../../src/createComponent';
import patchOps from '../../../src/client/patchOps';

const oldNode = createNode('div'),
    newNode = createNode('span'),
    replaceOp = patchOps.replace,
    C = createComponent({
        onRender() {
            return newNode;
        }
    });

export default {
    'name' : 'replace9',
    'trees' : [
        oldNode,
        createNode(C)
    ],
    'patch' : topNode => [
        { op : replaceOp, args : [topNode, oldNode, newNode] }
    ]
}
