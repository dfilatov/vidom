import normalizeNode from '../../src/nodes/utils/normalizeNode';
import { elem } from '../../src/vidom';

describe('normalizeNode', () => {
    it('should return null if passed object is null', () => {
        expect(normalizeNode(null))
            .to.be.equal(null);
    });

    it('should return null if passed object is undefined', () => {
        expect(normalizeNode(undefined))
            .to.be.equal(null);
    });

    it('should return null if all items are null or undefined', () => {
        expect(normalizeNode([null, undefined, [null, [undefined]]]))
            .to.be.equal(null);
    });

    it('should skip null, undefined and boolean items', () => {
        const node1 = elem('a'),
            node2 = elem('b');

        expect(normalizeNode([node1, true, null, node2, false, undefined]))
            .to.be.eql([node1, node2]);
    });

    it('should flatten items', () => {
        const node1 = elem('a'),
            node2 = elem('b'),
            node3 = elem('i');

        expect(normalizeNode([[node1], [[[node2]], node3]]))
            .to.be.eql([node1, node2, node3]);
    });

    it('should skip null while flattening', () => {
        const node1 = elem('a'),
            node2 = elem('b');

        expect(normalizeNode([[null, node1], [node2]]))
            .to.be.eql([node1, node2]);
    });

    it('should create text nodes for strings and numbers', () => {
        const node1 = elem('a'),
            node2 = elem('b');

        expect(normalizeNode(['str', node1, 0, node2, true]))
            .to.be.eql([
                elem('plaintext').setChildren('str'),
                node1,
                elem('plaintext').setChildren(0),
                node2
            ]);
    });

    it('should concat sibling text nodes', () => {
        const node = elem('a');

        expect(normalizeNode(['t1', 't2', node, 't3', 't4', ['t5', ['t6']]]))
            .to.be.eql([
                elem('plaintext').setChildren('t1t2'),
                node,
                elem('plaintext').setChildren('t3t4t5t6')
            ]);
    });

    it('should concat sibling text nodes in the middle of items', () => {
        const node1 = elem('a'),
            node2 = elem('b');

        expect(normalizeNode([node1, 't1', 't2', node2]))
            .to.be.eql([
                node1,
                elem('plaintext').setChildren('t1t2'),
                node2
            ]);
    });

    it('should do nothing for only string', () => {
        expect(normalizeNode('test'))
            .to.be.eql('test');
    });

    it('should normalize items with last string item', () => {
        const node = elem('a');

        expect(normalizeNode([node, 'test']))
            .to.be.eql([node, elem('plaintext').setChildren('test')]);
    });

    it('should concat simple items to only node', () => {
        expect(normalizeNode(['t1', null, 't2', 't3']))
            .to.be.eql('t1t2t3');
    });

    it('should properly skip null before strings', () => {
        expect(normalizeNode([null, 'test']))
            .to.be.eql('test');
    });

    it('should properly skip null after strings', () => {
        expect(normalizeNode(['test', null]))
            .to.be.eql('test');
    });

    it('should do nothing for only node child', () => {
        const node = elem('a');

        expect(normalizeNode(node))
            .to.be.eql(node);
    });

    it('should reuse existing array if possible', () => {
        const children = [elem('a'), elem('b')];

        expect(normalizeNode(children))
            .to.be.equal(children);
    });
});
