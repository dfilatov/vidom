import createNode from '../../../src/createNode';

export default {
    'name' : 'removeAttr4',
    'trees' : [
        createNode('input').setAttrs({ className : null }),
        createNode('input')
    ],
    'patch' : []
};
