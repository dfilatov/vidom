var createNode = require('../../../lib/createNode'),
    UpdateAttrOp = require('../../../lib/client/patchOps/UpdateAttr');

module.exports = {
    'name' : 'updateAttr4',
    'trees' : [
        createNode('div').attrs({
            style : {
                width : '100px',
                height : '100px',
                float : 'left',
                borderRadius : '5px',
                opacity : null
            }
        }),
        createNode('div').attrs({
            style : {
                width : '100px',
                float : 'right',
                background : 'red',
                borderRadius : null,
                color : null
            }
        })
    ],
    'patch' : [
        new UpdateAttrOp('style', {
            height : null,
            float : 'right',
            background : 'red',
            borderRadius : null
        })
    ]
};
