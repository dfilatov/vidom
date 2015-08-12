import createNode from '../../../lib/createNode';
import patchOps from '../../../lib/client/patchOps';

const node = createNode('input').attrs({ value : 'text' });

export default {
    'name' : 'updateAttr1',
    'trees' : [
        node,
        createNode('input').attrs({ value : 'new text' })
    ],
    'patch' : [
        { op : patchOps.updateAttr, args : [node, 'value', 'new text'] }
    ]
}
