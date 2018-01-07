import createElement from '../../../src/createElement';
import createComponent from '../../../src/createComponent';

const C1 = createComponent({
        onRender() {
            return createElement('div');
        }
    }),
    oldNode = createElement(C1),
    newNode = createElement(C1);

export default {
    'name' : 'replace5',
    'trees' : [
        oldNode,
        newNode
    ],
    'patch' : []
};
