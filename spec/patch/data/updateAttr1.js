import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const node = createNode('div').setAttrs({ id : 'id1' });

export default {
    'name' : 'updateAttr1',
    'trees' : [
        node,
        createNode('div').setAttrs({ id : 'id2' })
    ],
    'patch' : [
        { op : patchOps.updateAttr, args : [node, 'id', 'id2'] }
    ]
};
