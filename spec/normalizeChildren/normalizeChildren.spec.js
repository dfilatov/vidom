import normalizeChildren from '../../src/normalizeChildren';
import createNode from '../../src/createNode';

describe('normalizeChildren', () => {
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

    it('should create <span/> nodes for strings and numbers', () => {
        expect(normalizeChildren(['str', 0]))
            .to.be.eql([createNode('span').children('str'), createNode('span').children(0)]);
    });

    it('should do nothing for only simple child', () => {
        expect(normalizeChildren('test'))
            .to.be.eql('test');
    });

    it('should make array for only node child', () => {
        const node = createNode('a');

        expect(normalizeChildren(node))
            .to.be.eql([node]);
    });
});
