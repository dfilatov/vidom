import createNode from '../../../lib/createNode';
const node = createNode('select');

export default {
    'name' : 'updateAttr6',
    'trees' : [
        node
            .attrs({
                multiple : true,
                value : [1, 2, 3]
            }),
        createNode('select')
            .attrs({
                multiple : true,
                value : [1, 2, 3]
            })
    ],
    'patch' : []
}
