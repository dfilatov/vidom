var createNode = require('../../../lib/createNode'),
    patchOps = require('../../../lib/client/patchOps'),
    node = createNode('div').attrs({
        style : {
            width : '100px',
            height : '100px',
            float : 'left',
            borderRadius : '5px',
            opacity : null
        }
    });

module.exports = {
    'name' : 'updateAttr4',
    'trees' : [
        node,
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
        {
            op : patchOps.updateAttr,
            args : [
                node,
                'style',
                {
                    height : null,
                    float : 'right',
                    background : 'red',
                    borderRadius : null
                }
            ]
        }
    ]
};
