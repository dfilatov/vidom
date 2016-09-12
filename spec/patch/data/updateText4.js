import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const node = createNode('text').children('text');

export default {
    'name' : 'updateText4',
    'trees' : [
        node,
        createNode('text').children('new text')
    ],
    'patch' : [
        { op : patchOps.updateText, args : [node, 'new text', false] }
    ]
}
