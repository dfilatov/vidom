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

    it('should skip null while flattening', () => {
        const node1 = createNode('a'),
            node2 = createNode('b');

        expect(normalizeChildren([[null, node1], [node2]]))
            .to.be.eql([node1, node2]);
    });

    it('should create text nodes for strings, numbers and booleans', () => {
        const node1 = createNode('a'),
            node2 = createNode('b');

        expect(normalizeChildren(['str', node1, 0, node2, true]))
            .to.be.eql([
                createNode('plaintext').setChildren('str'),
                node1,
                createNode('plaintext').setChildren(0),
                node2,
                createNode('plaintext').setChildren('true')
            ]);
    });

    it('should concat sibling text nodes', () => {
        const node = createNode('a');

        expect(normalizeChildren(['t1', 't2', node, 't3', 't4', ['t5', ['t6']]]))
            .to.be.eql([
                createNode('plaintext').setChildren('t1t2'),
                node,
                createNode('plaintext').setChildren('t3t4t5t6')
            ]);
    });

    it('should concat sibling text nodes in the middle of children', () => {
        const node1 = createNode('a'),
            node2 = createNode('b');

        expect(normalizeChildren([node1, 't1', 't2', node2]))
            .to.be.eql([
                node1,
                createNode('plaintext').setChildren('t1t2'),
                node2
            ]);
    });

    it('should do nothing for only simple child', () => {
        expect(normalizeChildren('test'))
            .to.be.eql('test');
    });

    it('should normalize children with last simple child', () => {
        const node = createNode('a');

        expect(normalizeChildren([node, 'test']))
            .to.be.eql([node, createNode('plaintext').setChildren('test')]);
    });

    it('should concat simple children to only child', () => {
        expect(normalizeChildren(['t1', null, 't2', 't3']))
            .to.be.eql('t1t2t3');
    });

    it('should properly skip null before strings', () => {
        expect(normalizeChildren([null, 'test']))
            .to.be.eql('test');
    });

    it('should properly skip null after strings', () => {
        expect(normalizeChildren(['test', null]))
            .to.be.eql('test');
    });

    it('should do nothing for only node child', () => {
        const node = createNode('a');

        expect(normalizeChildren(node))
            .to.be.eql(node);
    });

    it('should reuse existing array if possible', () => {
        const children = [createNode('a'), createNode('b')];

        expect(normalizeChildren(children))
            .to.be.equal(children);
    });
});
