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
                if(('value' in attrs) && control.value !== attrs.value) {
                    control.value = attrs.value;
                }
            }
        };

        this.onClick = e => {
            let attrs = this.getAttrs();

            attrs.onClick && attrs.onClick(e);
            attrs.onChange && attrs.onChange(e);

            applyBatch();

            if(this.isMounted()) {
                // attrs could be changed during applyBatch()
                attrs = this.getAttrs();
                const control = this.getDomRef('control');
                if(('checked' in attrs) && control.checked !== attrs.checked) {
                    control.checked = attrs.checked;
                }
            }
        };
    },

    onRender(attrs) {
        const controlAttrs = { ...attrs, onChange : null };

        if(attrs.type === 'checkbox' || attrs.type === 'radio') {
            controlAttrs.onClick = this.onClick;
        }
        else {
            controlAttrs.onInput = this.onInput;
        }

        return this.setDomRef(
            'control',
            new TagNode('input').attrs(controlAttrs));
    }
});
