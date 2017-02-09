import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const node = createNode('button').setAttrs({ value : 'text' });

export default {
    'name' : 'updateAttr3',
    'trees' : [
        createNode('div').setChildren([
            createNode('button').setAttrs({ value : 'text' }),
            node
        ]),
        createNode('div').setChildren([
            createNode('button').setAttrs({ value : 'text' }),
            createNode('button').setAttrs({ value : 'new text' })
        ])
    ],
    'patch' : [
        { op : patchOps.updateAttr, args : [node, 'value', 'new text'] }
    ]
};
