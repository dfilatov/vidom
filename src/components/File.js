import createComponent from '../createComponent';
import TagElement from '../nodes/TagElement';

export default createComponent({
    onRender() {
        return new TagElement('input', null, this.attrs);
    },

    onRefRequest() {
        return this.getDomNode();
    }
});
