import createComponent from '../createComponent';
import TagNode from '../nodes/TagNode';
import { applyBatch } from '../client/rafBatch';
import merge from '../utils/merge';

export default createComponent({
    onInit() {
        this.onInput = e => {
            let attrs = this.getAttrs();

            attrs.onInput && attrs.onInput(e);
            attrs.onChange && attrs.onChange(e);

            applyBatch();

            if(this.isMounted()) {
                // attrs could be changed during applyBatch()
                attrs = this.getAttrs();
                const control = this.getDomRef('control');
                if(typeof attrs.value !== 'undefined' && control.value !== attrs.value) {
                    control.value = attrs.value;
                }
            }
        };
    },

    onRender(attrs) {
        return this.setDomRef(
            'control',
            new TagNode('textarea')
                .attrs(merge(attrs, { onInput : this.onInput, onChange : null })));
    }
});
