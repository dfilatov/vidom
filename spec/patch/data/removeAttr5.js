var createNode = require('../../../lib/createNode');

module.exports = {
    'name' : 'removeAttr5',
    'trees' : [
        createNode('input'),
        createNode('input').attrs({ className : null })
    ],
    'patch' : []
};
