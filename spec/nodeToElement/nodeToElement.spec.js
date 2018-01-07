import { elem } from '../../src/vidom';
import nodeToElement from '../../src/nodes/utils/nodeToElement';
import TagElement from '../../src/nodes/TagElement';
import TextElement from '../../src/nodes/TextElement';
import FragmentElement from '../../src/nodes/FragmentElement';

describe('nodeToElement', () => {
    it('should return the same element if it\'s passed', () => {
        const element = elem('div');

        expect(nodeToElement(element))
            .to.be.equal(element);
    });

    it('should return text element if string is passed', () => {
        const element = nodeToElement('text');

        expect(element instanceof TextElement)
            .to.be.ok();
        expect(element.children)
            .to.be.equal('text');
    });

    it('should return fragment element if array is passed', () => {
        const items = [elem('div')],
            element = nodeToElement(items);

        expect(element instanceof FragmentElement)
            .to.be.ok();
        expect(element.children)
            .to.be.equal(items);
    });

    it('should return comment element if null is passed', () => {
        const element = nodeToElement(null);

        expect(element instanceof TagElement)
            .to.be.ok();
        expect(element.tag)
            .to.be.equal('!');
    });
});
