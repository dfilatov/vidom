var createNode = require('../../../lib/createNode'),
    patchOps = require('../../../lib/client/patchOps'),
    node = createNode('a');

module.exports = {
    'name' : 'removeText2',
    'trees' : [
        node.children(''),
        createNode('a')
    ],
    'patch' : []
};
