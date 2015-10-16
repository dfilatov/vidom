import createComponent from '../createComponent';
import TagNode from '../nodes/TagNode';
import { applyBatch } from '../client/rafBatch';

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
                if(control.value !== attrs.value) {
                    control.value = attrs.value;
                }
            }
        };
    },

    onRender(attrs) {
        const controlAttrs = {
            ...attrs,
            onInput : this.onInput,
            onChange : null
        };

        return this.setDomRef(
            'control',
            new TagNode('textarea').attrs(controlAttrs));
    }
});
