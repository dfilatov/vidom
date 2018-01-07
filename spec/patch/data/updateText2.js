import createElement from '../../../src/createElement';

export default {
    'name' : 'updateText2',
    'trees' : [
        createElement('span').setChildren('text'),
        createElement('span').setChildren('text')
    ],
    'patch' : []
};
