import createComponent from '../createComponent';
import TagElement from '../nodes/TagElement';

export default createComponent({
    onRender() {
        return new TagElement('input').setAttrs(this.attrs);
    },

    onRefRequest() {
        return this.getDomNode();
    }
});
