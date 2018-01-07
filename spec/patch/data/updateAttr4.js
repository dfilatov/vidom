import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const node = createElement('div').setAttrs({
    style : {
        width : '100px',
        height : '100px',
        float : 'left',
        borderRadius : '5px',
        opacity : null
    }
});

export default {
    'name' : 'updateAttr4',
    'trees' : [
        node,
        createElement('div').setAttrs({
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
