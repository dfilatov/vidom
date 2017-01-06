import createNode from '../../../src/createNode';
import createComponent from '../../../src/createComponent';

const C1 = createComponent({
        onRender() {
            return createNode('div');
        }
    }),
    oldNode = createNode(C1),
    newNode = createNode(C1);

export default {
    'name' : 'replace5',
    'trees' : [
        oldNode,
        newNode
    ],
    'patch' : []
};
