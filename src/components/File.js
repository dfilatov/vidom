import createComponent from '../createComponent';
import TagNode from '../nodes/TagNode';

export default createComponent({
    onRender(attrs) {
        return new TagNode('input').attrs(attrs);
    },

    getRef() {
        return this.getDomNode();
    }
});
