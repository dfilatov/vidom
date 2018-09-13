import { h } from '../../../src/vidom';

const node = h('a', null, '');

export default {
    'name' : 'removeText2',
    'trees' : [
        node,
        h('a')
    ],
    'patch' : []
};
