import TagElement from './nodes/TagElement';
import ComponentElement from './nodes/ComponentElement';
import FunctionComponentElement from './nodes/FunctionComponentElement';
import FragmentElement from './nodes/FragmentElement';
import TextElement from './nodes/TextElement';
import Input from './components/Input';
import TextArea from './components/TextArea';
import Select from './components/Select';
import { IS_DEBUG } from './utils/debug';

export default function createElement(type, key, attrs, children, ref, escapeChildren) {
    switch(typeof type) {
        case 'string':
            switch(type) {
                case 'fragment':
                    return new FragmentElement(key, children);

                case 'plaintext':
                    return new TextElement(key, children);

                case 'input':
                    return new ComponentElement(Input, key, attrs, children, ref);

                case 'textarea':
                    return new ComponentElement(TextArea, key, attrs, children, ref);

                case 'select':
                    return new ComponentElement(Select, key, attrs, children, ref);

                default:
                    return new TagElement(type, key, attrs, children, ref, escapeChildren);
            }

        case 'function':
            return type.__vidom__component__?
                new ComponentElement(type, key, attrs, children, ref) :
                new FunctionComponentElement(type, key, attrs, children);

        default:
            if(IS_DEBUG) {
                throw TypeError('vidom: Unexpected type of element is passed to the elements factory.');
            }
    }
}
