import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const node = createNode('span').setChildren('text');

export default {
    'name' : 'updateText1',
    'trees' : [
        node,
        createNode('span').setChildren('new text')
    ],
    'patch' : [
        { op : patchOps.updateText, args : [node, 'new text', true] }
    ]
};
