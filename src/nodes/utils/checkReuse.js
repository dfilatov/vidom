import console from '../../utils/console';

export default function checkReuse(node, name) {
    if(node.getDomNode()) {
        console.error(`You\'re trying to reuse the same node "${name}" more than once.`);
    }
}
