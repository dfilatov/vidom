import normalizeNode from '../../src/nodes/utils/normalizeNode';
import { h } from '../../src/vidom';

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
        const node1 = h('a'),
            node2 = h('b');

        expect(normalizeNode([node1, true, null, node2, false, undefined]))
            .to.be.eql([node1, node2]);
    });

    it('should flatten items', () => {
        const node1 = h('a'),
            node2 = h('b'),
            node3 = h('i');

        expect(normalizeNode([[node1], [[[node2]], node3]]))
            .to.be.eql([node1, node2, node3]);
    });

    it('should skip null while flattening', () => {
        const node1 = h('a'),
            node2 = h('b');

        expect(normalizeNode([[null, node1], [node2]]))
            .to.be.eql([node1, node2]);
    });

    it('should create text nodes for strings and numbers', () => {
        const node1 = h('a'),
            node2 = h('b');

        expect(normalizeNode(['str', node1, 0, node2, true]))
            .to.be.eql([
                h('plaintext', null, 'str'),
                node1,
                h('plaintext', null, 0),
                node2
            ]);
    });

    it('should concat sibling text nodes', () => {
        const node = h('a');

        expect(normalizeNode(['t1', 't2', node, 't3', 't4', ['t5', ['t6']]]))
            .to.be.eql([
                h('plaintext', null, 't1t2'),
                node,
                h('plaintext', null, 't3t4t5t6')
            ]);
    });

    it('should concat sibling text nodes in the middle of items', () => {
        const node1 = h('a'),
            node2 = h('b');

        expect(normalizeNode([node1, 't1', 't2', node2]))
            .to.be.eql([
                node1,
                h('plaintext', null, 't1t2'),
                node2
            ]);
    });

    it('should do nothing for only string', () => {
        expect(normalizeNode('test'))
            .to.be.eql('test');
    });

    it('should normalize items with last string item', () => {
        const node = h('a');

        expect(normalizeNode([node, 'test']))
            .to.be.eql([node, h('plaintext', null, 'test')]);
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
        const node = h('a');

        expect(normalizeNode(node))
            .to.be.eql(node);
    });

    it('should not modify array child', () => {
        const child = [h('a')];

        normalizeNode([child, h('b')]);

        expect(child).to.have.length(1);
    });

    it('should reuse existing array if possible', () => {
        const children = [h('a'), h('b')];

        expect(normalizeNode(children))
            .to.be.equal(children);
    });
});
