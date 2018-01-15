import patchOps from '../../../src/client/patchOps';
import { h } from '../../helpers';

const node = h('div', {
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
        h('div', {
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
