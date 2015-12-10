import createNode from '../../../src/createNode';
import createComponent from '../../../src/createComponent';
import patchOps from '../../../src/client/patchOps';

const oldNode = createNode('div'),
    newNode = createNode('span'),
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
    'patch' : [
        { op : patchOps.replace, args : [null, oldNode, newNode] }
    ]
}
