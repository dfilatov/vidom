import createNode from '../../../src/createNode';

const node = createNode('select');

export default {
    'name' : 'updateAttr6',
    'trees' : [
        node
            .setAttrs({
                multiple : true,
                value : [1, 2, 3]
            }),
        createNode('select')
            .setAttrs({
                multiple : true,
                value : [1, 2, 3]
            })
    ],
    'patch' : []
};
