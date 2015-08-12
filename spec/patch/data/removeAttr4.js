import createNode from '../../../lib/createNode';

export default {
    'name' : 'removeAttr4',
    'trees' : [
        createNode('input').attrs({ className : null }),
        createNode('input')
    ],
    'patch' : []
}
