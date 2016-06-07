export default function normalizeNs(node, parent) {
    if(!node._ns && parent._ns) {
        node._ns = parent._ns;
    }
}
