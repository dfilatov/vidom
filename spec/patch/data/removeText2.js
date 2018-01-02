import createElement from '../../../src/createElement';

const node = createElement('a');

export default {
    'name' : 'removeText2',
    'trees' : [
        node.setChildren(''),
        createElement('a')
    ],
    'patch' : []
};
