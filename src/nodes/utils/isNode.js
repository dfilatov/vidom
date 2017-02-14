import ComponentNode from '../ComponentNode';
import FragmentNode from '../FragmentNode';
import FunctionComponentNode from '../FunctionComponentNode';
import TagNode from '../TagNode';
import TextNode from '../TextNode';

export default function isNode(obj) {
    return obj instanceof ComponentNode ||
        obj instanceof FragmentNode ||
        obj instanceof FunctionComponentNode ||
        obj instanceof TagNode ||
        obj instanceof TextNode;
}
