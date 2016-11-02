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

    onRender(attrs) {
        return new TagNode('input').attrs(merge(attrs, this._addAttrs));
    },

    onChange(e) {
        const { onChange } = this.getAttrs();

        onChange && onChange(e);

        applyBatch();

        if(this.isMounted()) {
            const control = this.getDomNode(),
                { checked } = this.getAttrs(); // attrs could be changed during applyBatch()

            if(typeof checked !== 'undefined' && control.checked !== checked) {
                control.checked = checked;
            }
        }
    },

    getRef() {
        return this.getDomNode();
    }
});
