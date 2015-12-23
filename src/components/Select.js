import createComponent from '../createComponent';
import TagNode from '../nodes/TagNode';
import { applyBatch } from '../client/rafBatch';

export default createComponent({
    onInit() {
        this.onChange = e => {
            let attrs = this.getAttrs();

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

    onRender(attrs, children) {
        const controlAttrs = {
            ...attrs,
            onChange : this.onChange
        };

        return this.setDomRef(
            'control',
            new TagNode('select').attrs(controlAttrs).children(children));
    }
});
