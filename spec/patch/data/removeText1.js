import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const node = createNode('a');

export default {
    'name' : 'removeText1',
    'trees' : [
        node.setChildren('text'),
        createNode('a')
    ],
    'patch' : [
        { op : patchOps.removeText, args : [node] }
    ]
};
