import { elem } from '../src/vidom';

export function h(type, props) {
    let hasNonAttrsProps = false,
        attrs,
        key,
        ref,
        children,
        escapeChildren;

    if(props) {
        for(let i in props) {
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

                case 'children':
                    children = props[i];
                    hasNonAttrsProps = true;
                    break;

                default:
                    (attrs || (attrs = Object.create(null)))[i] = props[i];
            }
        }
    }

    return elem(type, key, hasNonAttrsProps? attrs : props, children, ref, escapeChildren);
}
