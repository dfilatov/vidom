import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const node = createNode('div').attrs({ id : 'id1' });

export default {
    'name' : 'updateAttr1',
    'trees' : [
        node,
        createNode('div').attrs({ id : 'id2' })
    ],
    'patch' : [
        { op : patchOps.updateAttr, args : [node, 'id', 'id2'] }
    ]
}
