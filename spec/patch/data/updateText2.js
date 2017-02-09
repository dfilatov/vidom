import createNode from '../../../src/createNode';

export default {
    'name' : 'updateText2',
    'trees' : [
        createNode('span').setChildren('text'),
        createNode('span').setChildren('text')
    ],
    'patch' : []
};
