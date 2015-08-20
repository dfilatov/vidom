import createNode from '../../../src/createNode';

export default {
    'name' : 'removeAttr4',
    'trees' : [
        createNode('input').attrs({ className : null }),
        createNode('input')
    ],
    'patch' : []
}
