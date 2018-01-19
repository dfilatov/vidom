import createComponent from '../../../src/createComponent';
import { h } from '../../helpers';

const C1 = createComponent({
        onRender() {
            return h('div');
        }
    }),
    oldNode = h(C1),
    newNode = h(C1);

export default {
    'name' : 'replace5',
    'trees' : [
        oldNode,
        newNode
    ],
    'patch' : []
};
