import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const node = createNode('button');

export default {
    'name' : 'removeAttr2',
    'trees' : [
        node.attrs({ value : 'text', className : 'button' }),
        createNode('button')
    ],
    'patch' : [
        { op : patchOps.removeAttr, args : [node, 'value'] },
        { op : patchOps.removeAttr, args : [node, 'className'] }
    ]
};
