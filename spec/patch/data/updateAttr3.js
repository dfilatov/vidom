import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const node = createElement('button').setAttrs({ value : 'text' });

export default {
    'name' : 'updateAttr3',
    'trees' : [
        createElement('div').setChildren([
            createElement('button').setAttrs({ value : 'text' }),
            node
        ]),
        createElement('div').setChildren([
            createElement('button').setAttrs({ value : 'text' }),
            createElement('button').setAttrs({ value : 'new text' })
        ])
    ],
    'patch' : [
        { op : patchOps.updateAttr, args : [node, 'value', 'new text'] }
    ]
};
