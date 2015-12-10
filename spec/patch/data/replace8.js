import createNode from '../../../src/createNode';

const oldNode = createNode('div'),
    newNode = createNode(() => createNode('div'));

export default {
    'name' : 'replace8',
    'trees' : [
        oldNode,
        newNode
    ],
    'patch' : []
}
