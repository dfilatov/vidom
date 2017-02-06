import createComponent from '../createComponent';
import TagNode from '../nodes/TagNode';
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
        return new TagNode('textarea').attrs(merge(this.attrs, this._addAttrs));
    },

    onInput(e) {
        const { onChange } = this.attrs;

        onChange && onChange(e);

        applyBatch();

        if(this.isMounted()) {
            const control = this.getDomNode(),
                { value } = this.attrs; // attrs could be changed during applyBatch()

            if(typeof value !== 'undefined' && control.value !== value) {
                control.value = value;
            }
        }
    },

    onRefRequest() {
        return this.getDomNode();
    }
});
