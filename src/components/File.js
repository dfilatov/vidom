import createComponent from '../createComponent';
import TagNode from '../nodes/TagNode';

export default createComponent({
    onRender() {
        return new TagNode('input').attrs(this.attrs);
    },

    onRefRequest() {
        return this.getDomNode();
    }
});
