import createNode from '../../../src/createNode';
import createComponent from '../../../src/createComponent';
import patchOps from '../../../src/client/patchOps';

const C1 = createComponent({
        onRender() {
            return createNode('div');
        }
    }),
    C2 = createComponent({
        onRender() {
            return createNode('div');
        }
    }),
    oldNode = createNode(C1),
    newNode = createNode(C2);

export default {
    'name' : 'replace5',
    'trees' : [
        oldNode,
        newNode
    ],
    'patch' : []
}
