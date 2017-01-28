export default function renderToString(tree) {
    return '<!--vidom-->' + tree.renderToString();
}
