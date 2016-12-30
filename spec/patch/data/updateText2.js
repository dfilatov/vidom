import createNode from '../../../src/createNode';

export default {
    'name' : 'updateText2',
    'trees' : [
        createNode('span').children('text'),
        createNode('span').children('text')
    ],
    'patch' : []
};
