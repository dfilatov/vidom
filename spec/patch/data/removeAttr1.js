import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

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
