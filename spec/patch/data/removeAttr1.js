import createNode from '../../../lib/createNode';
import patchOps from '../../../lib/client/patchOps';

const node = createNode('input');

export default {
    'name' : 'removeAttr1',
    'trees' : [
        node.attrs({ value : 'text', className : 'input' }),
        createNode('input').attrs({ value : 'text' })
    ],
    'patch' : [
        { op : patchOps.removeAttr, args : [node, 'className'] }
    ]
}
