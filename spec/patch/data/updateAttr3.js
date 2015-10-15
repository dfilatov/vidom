import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const node = createNode('button').attrs({ value : 'text' });

export default {
    'name' : 'updateAttr3',
    'trees' : [
        createNode('div').children([
            createNode('button').attrs({ value : 'text' }),
            node
        ]),
        createNode('div').children([
            createNode('button').attrs({ value : 'text' }),
            createNode('button').attrs({ value : 'new text' })
        ])
    ],
    'patch' : [
        { op : patchOps.updateAttr, args : [node, 'value', 'new text'] }
    ]
}
