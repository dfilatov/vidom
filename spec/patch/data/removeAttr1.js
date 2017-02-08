import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const node = createNode('button');

export default {
    'name' : 'removeAttr1',
    'trees' : [
        node.setAttrs({ value : 'text', className : 'input' }),
        createNode('button').setAttrs({ value : 'text' })
    ],
    'patch' : [
        { op : patchOps.removeAttr, args : [node, 'className'] }
    ]
};
