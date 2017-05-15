import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const node = createNode('plaintext').setChildren('text');

export default {
    'name' : 'updateText4',
    'trees' : [
        node,
        createNode('plaintext').setChildren('new text')
    ],
    'patch' : [
        { op : patchOps.updateText, args : [node, 'new text', false] }
    ]
};
