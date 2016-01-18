import normalizeChildren from '../../src/utils/normalizeChildren';
import createNode from '../../src/createNode';

describe('normalizeChildren', () => {
    it('should return null if children are null', () => {
        expect(normalizeChildren(null))
            .to.be.equal(null);
    });

    it('should return null if children are undefined', () => {
        expect(normalizeChildren(undefined))
            .to.be.equal(null);
    });

    it('should return null if all children are null or undefined', () => {
        expect(normalizeChildren([null, undefined, [null, [undefined]]]))
            .to.be.equal(null);
    });

    it('should skip null and undefined children', () => {
        const node1 = createNode('a'),
            node2 = createNode('b');

        expect(normalizeChildren([node1, null, node2, undefined]))
            .to.be.eql([node1, node2]);
    });

    it('should flatten children', () => {
        const node1 = createNode('a'),
            node2 = createNode('b'),
            node3 = createNode('i');

        expect(normalizeChildren([[node1], [[[node2]], node3]]))
            .to.be.eql([node1, node2, node3]);
    });

    it('should create <span/> nodes for strings, numbers and booleans', () => {
        const node = createNode('a');

        expect(normalizeChildren(['str', node, 0, true]))
            .to.be.eql([
                createNode('span').children('str'),
                node,
                createNode('span').children(0),
                createNode('span').children('true')
            ]);
    });

    it('should do nothing for only simple child', () => {
        expect(normalizeChildren('test'))
            .to.be.eql('test');
    });

    it('should properly skip null after strings', () => {
        expect(normalizeChildren(['test', null]))
            .to.be.eql([createNode('span').children('test')]);
    });

    it('should make array for only node child', () => {
        const node = createNode('a');

        expect(normalizeChildren(node))
            .to.be.eql([node]);
    });

    it('should reuse existing array if possible', () => {
        const children = [createNode('a'), createNode('b')];

        expect(normalizeChildren(children))
            .to.be.equal(children);
    });
});
