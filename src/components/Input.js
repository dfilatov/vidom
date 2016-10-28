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
                const control = this.getDomRef('control'),
                    { value } = this.getAttrs(); // attrs could be changed during applyBatch()

                if(typeof value !== 'undefined' && control.value !== value) {
                    control.value = value;
                }
            }
        };

        this.onClick = e => {
            let attrs = this.getAttrs();

            attrs.onClick && attrs.onClick(e);
            attrs.onChange && attrs.onChange(e);

            applyBatch();

            if(this.isMounted()) {
                const control = this.getDomRef('control'), // attrs could be changed during applyBatch()
                    { checked } = this.getAttrs();

                if(typeof checked !== 'undefined' && control.checked !== checked) {
                    control.checked = checked;
                }
            }
        };
    },

    onRender(attrs) {
        let controlAttrs;

        if(attrs.type === 'file') {
            controlAttrs = attrs;
        }
        else {
            controlAttrs = merge(attrs, { onChange : null });

            if(attrs.type === 'checkbox' || attrs.type === 'radio') {
                controlAttrs.onClick = this.onClick;
            }
            else {
                controlAttrs.onInput = this.onInput;
            }
        }

        return this.setDomRef(
            'control',
            new TagNode('input').attrs(controlAttrs));
    }
});
