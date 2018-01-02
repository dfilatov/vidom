import nodeToElement from './nodes/utils/nodeToElement';

export default function renderToString(node) {
    return '<!--vidom-->' + nodeToElement(node).renderToString();
}
