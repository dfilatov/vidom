var createNode = require('../../../lib/createNode');

module.exports = {
    'name' : 'removeAttr4',
    'trees' : [
        createNode('input').attrs({ className : null }),
        createNode('input')
    ],
    'patch' : []
};
