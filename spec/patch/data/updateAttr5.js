import createNode from '../../../lib/createNode';
import patchOps from '../../../lib/client/patchOps';

const node = createNode('select');

export default {
    'name' : 'updateAttr5',
    'trees' : [
        node
            .attrs({
                multiple : true,
                value : [1, 2, 3]
            }),
        createNode('select')
            .attrs({
                multiple : true,
                value : [1, 2, 4]
            })
    ],
    'patch' : [
        { op : patchOps.updateAttr, args : [node, 'value', [1, 2, 4]] }
    ]
}
