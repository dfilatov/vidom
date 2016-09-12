import TagNode from './nodes/TagNode';
import ComponentNode from './nodes/ComponentNode';
import FunctionComponentNode from './nodes/FunctionComponentNode';
import FragmentNode from './nodes/FragmentNode';
import TextNode from './nodes/TextNode';
import Input from './components/Input';
import Textarea from './components/Textarea';
import Select from './components/Select';
import console from './utils/console';
import { IS_DEBUG } from './utils/debug';

const WRAPPER_COMPONENTS = {
    input : Input,
    textarea : Textarea,
    select : Select
};

export default function(type) {
    switch(typeof type) {
        case 'string':
            switch(type) {
                case 'fragment':
                    return new FragmentNode();

                case 'text':
                    return new TextNode();

                default:
                    return WRAPPER_COMPONENTS[type]?
                        new ComponentNode(WRAPPER_COMPONENTS[type]) :
                        new TagNode(type);
            }

        case 'function':
            return type.__vidom__component__?
                new ComponentNode(type) :
                new FunctionComponentNode(type);

        default:
            if(IS_DEBUG) {
                console.error('Unsupported type of node');
            }
    }
}
