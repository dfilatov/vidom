import createNode from '../../../lib/createNode';
import patchOps from '../../../lib/client/patchOps';

const node = createNode('input').attrs({ value : 'text' });

export default {
    'name' : 'updateAttr3',
    'trees' : [
        createNode('div').children([
            createNode('input').attrs({ value : 'text' }),
            createNode('input').attrs({ value : 'text' })
        ]),
        createNode('div').children([
            createNode('input').attrs({ value : 'text' }),
            createNode('input').attrs({ value : 'new text' })
        ])
    ],
    'patch' : [
        { op : patchOps.updateAttr, args : [node, 'value', 'new text'] }
    ]
}
