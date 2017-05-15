import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const node = createNode('plaintext');

export default {
    'name' : 'removeText3',
    'trees' : [
        node.setChildren('text'),
        createNode('plaintext')
    ],
    'patch' : [
        { op : patchOps.removeText, args : [node] }
    ]
};
