import createElement from './createElement';

const { slice } = Array.prototype;

export default function h(type, props) {
    let hasNonAttrsProps = false,
        attrs = null,
        key = null,
        ref = null,
        children = arguments.length > 2?
            arguments.length > 3?
                slice.call(arguments, 2) :
                arguments[2] :
            null,
        escapeChildren;

    if(props) {
        for(const i in props) {
            switch(i) {
                case 'key':
                    key = props[i];
                    hasNonAttrsProps = true;
                    break;

                case 'ref':
                    ref = props[i];
                    hasNonAttrsProps = true;
                    break;

                case 'html':
                    children = props[i];
                    escapeChildren = false;
                    hasNonAttrsProps = true;
                    break;

                default:
                    if(attrs === null) {
                        attrs = Object.create(null);
                    }

                    attrs[i] = props[i];
            }
        }
    }

    return createElement(type, key, hasNonAttrsProps? attrs : props, children, ref, escapeChildren);
}
