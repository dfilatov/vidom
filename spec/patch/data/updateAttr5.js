import patchOps from '../../../src/client/patchOps';
import { h } from '../../../src/vidom';

const node = h('select', {
        multiple : true,
        value : [1, 2, 3]
    }),
    rootNode = node._getInstance().getRootElement();

export default {
    'name' : 'updateAttr5',
    'trees' : [
        node,
        h('select', {
            multiple : true,
            value : [1, 2, 4]
        })
    ],
    'patch' : [
        { op : patchOps.updateAttr, args : [rootNode, 'value', [1, 2, 4]] }
    ]
};
