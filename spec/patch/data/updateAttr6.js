var createNode = require('../../../lib/createNode'),
    node = createNode('select');

module.exports = {
    'name' : 'updateAttr6',
    'trees' : [
        node
            .attrs({
                multiple : true,
                value : [1, 2, 3]
            }),
        createNode('select')
            .attrs({
                multiple : true,
                value : [1, 2, 3]
            })
    ],
    'patch' : []
};
