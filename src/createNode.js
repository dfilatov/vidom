import TagNode from './nodes/TagNode';
import ComponentNode from './nodes/ComponentNode';
import FunctionComponentNode from './nodes/FunctionComponentNode';
import FragmentNode from './nodes/FragmentNode';
import TextNode from './nodes/TextNode';
import Input from './components/Input';
import TextArea from './components/TextArea';
import Select from './components/Select';
import { IS_DEBUG } from './utils/debug';

export default function createNode(type) {
    switch(typeof type) {
        case 'string':
            switch(type) {
                case 'fragment':
                    return new FragmentNode();

                case 'text':
                    return new TextNode();

                case 'input':
                    return new ComponentNode(Input);

                case 'textarea':
                    return new ComponentNode(TextArea);

                case 'select':
                    return new ComponentNode(Select);

                default:
                    return new TagNode(type);
            }

        case 'function':
            return type.__vidom__component__?
                new ComponentNode(type) :
                new FunctionComponentNode(type);

        default:
            if(IS_DEBUG) {
                throw TypeError('vidom: Unexpected type of node is passed to the node factory.');
            }
    }
}
