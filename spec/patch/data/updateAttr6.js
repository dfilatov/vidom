import createElement from '../../../src/createElement';

const node = createElement('select');

export default {
    'name' : 'updateAttr6',
    'trees' : [
        node
            .setAttrs({
                multiple : true,
                value : [1, 2, 3]
            }),
        createElement('select')
            .setAttrs({
                multiple : true,
                value : [1, 2, 3]
            })
    ],
    'patch' : []
};
