import createElement from '../../../src/createElement';

const C1 = () => createElement('div'),
    oldNode = createElement(C1),
    newNode = createElement(C1);

export default {
    'name' : 'replace6',
    'trees' : [
        oldNode,
        newNode
    ],
    'patch' : []
};
