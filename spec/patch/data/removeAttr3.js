import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const node = createNode('button');

export default {
    'name' : 'removeAttr3',
    'trees' : [
        node.setAttrs({ className : 'button' }),
        createNode('button').setAttrs({ className : null })
    ],
    'patch' : [
        { op : patchOps.removeAttr, args : [node, 'className'] }
    ]
};
