import { h } from '../../helpers';

const node = h('a', { children : '' });

export default {
    'name' : 'removeText2',
    'trees' : [
        node,
        h('a')
    ],
    'patch' : []
};
