import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const node = createNode('input').attrs({ value : 'text' });

export default {
    'name' : 'updateAttr2',
    'trees' : [
        node,
        createNode('input').attrs({ value : 'text', disabled : true })
    ],
    'patch' : [
        { op : patchOps.updateAttr, args : [node, 'disabled', true] }
    ]
}
