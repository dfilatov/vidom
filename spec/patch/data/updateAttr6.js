import { h } from '../../../src/vidom';

const node = h('select', {
    multiple : true,
    value : [1, 2, 3]
});

export default {
    'name' : 'updateAttr6',
    'trees' : [
        node,
        h('select', {
            multiple : true,
            value : [1, 2, 3]
        })
    ],
    'patch' : []
};
