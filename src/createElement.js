import TagElement from './nodes/TagElement';
import ComponentElement from './nodes/ComponentElement';
import FunctionComponentElement from './nodes/FunctionComponentElement';
import FragmentElement from './nodes/FragmentElement';
import TextElement from './nodes/TextElement';
import Input from './components/Input';
import TextArea from './components/TextArea';
import Select from './components/Select';
import { IS_DEBUG } from './utils/debug';

export default function createElement(type) {
    switch(typeof type) {
        case 'string':
            switch(type) {
                case 'fragment':
                    return new FragmentElement();

                case 'plaintext':
                    return new TextElement();

                case 'input':
                    return new ComponentElement(Input);

                case 'textarea':
                    return new ComponentElement(TextArea);

                case 'select':
                    return new ComponentElement(Select);

                default:
                    return new TagElement(type);
            }

        case 'function':
            return type.__vidom__component__?
                new ComponentElement(type) :
                new FunctionComponentElement(type);

        default:
            if(IS_DEBUG) {
                throw TypeError('vidom: Unexpected type of element is passed to the elements factory.');
            }
    }
}
