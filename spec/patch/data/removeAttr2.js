import createNode from '../../../lib/createNode';
import patchOps from '../../../lib/client/patchOps';

const node = createNode('input');

export default {
    'name' : 'removeAttr2',
    'trees' : [
        node.attrs({ value : 'text', className : 'input' }),
        createNode('input')
    ],
    'patch' : [
        { op : patchOps.removeAttr, args : [node, 'value'] },
        { op : patchOps.removeAttr, args : [node, 'className'] }
    ]
}
