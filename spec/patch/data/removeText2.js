import createNode from '../../../src/createNode';

const node = createNode('a');

export default {
    'name' : 'removeText2',
    'trees' : [
        node.setChildren(''),
        createNode('a')
    ],
    'patch' : []
};
