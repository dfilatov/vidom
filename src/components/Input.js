import createComponent from '../createComponent';
import TagElement from '../nodes/TagElement';
import { applyBatch } from '../client/rafBatch';
import merge from '../utils/merge';

export default createComponent({
    onInit() {
        this._addAttrs = {
            onChange : null,
            onInput : e => {
                this.onInput(e);
            }
        };
    },

    onRender() {
        return new TagElement('input', null, merge(this.attrs, this._addAttrs));
    },

    onInput(e) {
        const { onChange, value = '' } = this.attrs,
            control = this.getDomNode();

        if(value !== control.value) {
            if(onChange) {
                onChange(e);
            }

            applyBatch();

            if(this.isMounted()) {
                const { value } = this.attrs; // attrs could be changed during applyBatch()

                if(typeof value !== 'undefined' && control.value !== value) {
                    control.value = value;
                }
            }
        }
    },

    onRefRequest() {
        return this.getDomNode();
    }
});
