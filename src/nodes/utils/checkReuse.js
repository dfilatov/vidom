export default function checkReuse(node, name) {
    if(node.getDomNode()) {
        throw Error(`vidom: Detected unexpected attempt to reuse the same node "${name}".`);
    }
}
