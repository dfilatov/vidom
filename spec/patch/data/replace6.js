import createNode from '../../../src/createNode';

const C1 = () => createNode('div'),
    oldNode = createNode(C1),
    newNode = createNode(C1);

export default {
    'name' : 'replace6',
    'trees' : [
        oldNode,
        newNode
    ],
    'patch' : []
};
