import createNode from '../../../src/createNode';

export default {
    'name' : 'removeAttr5',
    'trees' : [
        createNode('input'),
        createNode('input').attrs({ className : null })
    ],
    'patch' : []
};
