import { h } from '../../helpers';

const C1 = () => h('div'),
    oldNode = h(C1),
    newNode = h(C1);

export default {
    'name' : 'replace6',
    'trees' : [
        oldNode,
        newNode
    ],
    'patch' : []
};
