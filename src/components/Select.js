import createComponent from '../createComponent';
import TagNode from '../nodes/TagNode';
import { applyBatch } from '../client/rafBatch';
import merge from '../utils/merge';

export default createComponent({
    onInit() {
        this._addAttrs = {
            onChange : e => {
                this.onChange(e);
            }
        };
    },

    onRender(attrs, children) {
        return new TagNode('select')
            .attrs(merge(attrs, this._addAttrs))
            .children(children);
    },

    onChange(e) {
        const { onChange } = this.getAttrs();

        onChange && onChange(e);

        applyBatch();

        if(this.isMounted()) {
            const control = this.getDomNode(),
                { value } = this.getAttrs(); // attrs could be changed during applyBatch()

            if(typeof value !== 'undefined' && control.value !== value) {
                control.value = value;
            }
        }
    },

    onRefRequest() {
        return this.getDomNode();
    }
});
