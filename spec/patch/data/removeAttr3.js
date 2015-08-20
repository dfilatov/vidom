import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const node = createNode('input');

export default {
    'name' : 'removeAttr3',
    'trees' : [
        node.attrs({ className : 'input' }),
        createNode('input').attrs({ className : null })
    ],
    'patch' : [
        { op : patchOps.removeAttr, args : [node, 'className'] }
    ]
}
