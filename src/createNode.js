import TagNode from './nodes/TagNode';
import ComponentNode from './nodes/ComponentNode';
import FunctionComponentNode from './nodes/FunctionComponentNode';
import FragmentNode from './nodes/FragmentNode';
import Input from './components/Input';
import Textarea from './components/Textarea';
import Select from './components/Select';
import console from './utils/console';

const WRAPPER_COMPONENTS = {
    input : Input,
    textarea : Textarea,
    select : Select
};

export default function(type) {
    switch(typeof type) {
        case 'string':
            return type === 'fragment'?
                new FragmentNode() :
                WRAPPER_COMPONENTS[type]?
                    new ComponentNode(WRAPPER_COMPONENTS[type]) :
                    new TagNode(type);

        case 'function':
            return type.__vidom__component__?
                new ComponentNode(type) :
                new FunctionComponentNode(type);

        default:
            if(process.env.NODE_ENV !== 'production') {
                console.error('Unsupported type of node');
            }
    }
}
