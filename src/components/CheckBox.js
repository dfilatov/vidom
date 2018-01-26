import createComponent from '../createComponent';
import TagElement from '../nodes/TagElement';
import { applyBatch } from '../client/rafBatch';
import merge from '../utils/merge';

export default createComponent({
    onInit() {
        this._addAttrs = {
            onChange : e => {
                this.onInputChange(e);
            }
        };
    },

    onRender() {
        return new TagElement('input', null, merge(this.attrs, this._addAttrs));
    },

    onInputChange(e) {
        const { onChange } = this.attrs;

        if(onChange) {
            onChange(e);
        }

        applyBatch();

        if(this.isMounted()) {
            const control = this.getDomNode(),
                { checked } = this.attrs; // attrs could be changed during applyBatch()

            if(typeof checked !== 'undefined' && control.checked !== checked) {
                control.checked = checked;
            }
        }
    },

    onRefRequest() {
        return this.getDomNode();
    }
});
