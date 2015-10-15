import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const node = createNode('button');

export default {
    'name' : 'removeAttr3',
    'trees' : [
        node.attrs({ className : 'button' }),
        createNode('button').attrs({ className : null })
    ],
    'patch' : [
        { op : patchOps.removeAttr, args : [node, 'className'] }
    ]
}
