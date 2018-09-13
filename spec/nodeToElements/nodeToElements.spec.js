import childrenToArray from '../../src/nodes/utils/nodeToElements';
import { h } from '../../src/vidom';

describe('nodeToElements', () => {
    it('should return empty array if passed object is nullified item', () => {
        expect(childrenToArray(null))
            .to.be.eql([]);

        expect(childrenToArray(undefined))
            .to.be.eql([]);

        expect(childrenToArray(''))
            .to.be.eql([]);

        expect(childrenToArray(true))
            .to.be.eql([]);

        expect(childrenToArray(false))
            .to.be.eql([]);
    });

    it('should return empty array if passed object is nullified items', () => {
        expect(childrenToArray([null, true, false, '', undefined]))
            .to.be.eql([]);
    });

    it('should transform string to array with plaintext node', () => {
        expect(childrenToArray('str'))
            .to.be.eql([h('plaintext', null, 'str')]);
    });

    it('should trasnform array of strings to array with only plaintext node', () => {
        expect(childrenToArray(['str1', 'str2']))
            .to.be.eql([h('plaintext', null, 'str1str2')]);
    });

    it('should transform given element to array with only item', () => {
        expect(childrenToArray(h('div')))
            .to.be.eql([h('div')]);
    });

    it('should transform given array to array with only valid items', () => {
        expect(childrenToArray(['', h('div'), 'str', false, h('span'), null]))
            .to.be.eql([h('div'), h('plaintext', null, 'str'), h('span')]);
    });

    it('should return exact given array if it contains only valid items', () => {
        const children = [h('div'), h('span')];

        expect(childrenToArray(children))
            .to.be.equal(children);
    });
});

