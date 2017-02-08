import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const node = createNode('text').setChildren('text');

export default {
    'name' : 'updateText4',
    'trees' : [
        node,
        createNode('text').setChildren('new text')
    ],
    'patch' : [
        { op : patchOps.updateText, args : [node, 'new text', false] }
    ]
};
