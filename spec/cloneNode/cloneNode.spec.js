import { node, createComponent } from '../../src/vidom';

describe('cloneNode', () => {
    describe('tag node', () => {
        it('should copy original fields', () => {
            const origNode = node('a').key('1').attrs({ href : '/' }).children('link').ctx({}),
                clonedNode = origNode.clone();

            expect(clonedNode.type).to.equal(origNode.type);
            expect(clonedNode._tag).to.equal(origNode._tag);
            expect(clonedNode._key).to.equal(origNode._key);
            expect(clonedNode._attrs).to.equal(origNode._attrs);
            expect(clonedNode._children).to.equal(origNode._children);
            expect(clonedNode._ctx).to.equal(origNode._ctx);
        });

        it('should merge attrs', () => {
            const origNode = node('a').attrs({ href : '/', tabIndex : 2 }),
                clonedNode = origNode.clone().attrs({ target : '_blank', tabIndex : 3 });

            expect(clonedNode._attrs).to.eql({ href : '/', target : '_blank', tabIndex : 3 });
        });

        it('should replace children', () => {
            const origNode = node('a').children('link1'),
                clonedNode = origNode.clone().children('link2');

            expect(clonedNode._children).to.equal('link2');
        });
    });

    describe('component node', () => {
        const C = createComponent({});

        it('should copy original fields', () => {
            const origNode = node(C).key('1').attrs({ href : '/' }).children('link').ctx({}),
                clonedNode = origNode.clone();

            expect(clonedNode.type).to.equal(origNode.type);
            expect(clonedNode._component).to.equal(origNode._component);
            expect(clonedNode._key).to.equal(origNode._key);
            expect(clonedNode._attrs).to.equal(origNode._attrs);
            expect(clonedNode._children).to.equal(origNode._children);
            expect(clonedNode._ctx).to.equal(origNode._ctx);
        });

        it('should merge attrs', () => {
            const origNode = node(C).attrs({ href : '/', tabIndex : 2 }),
                clonedNode = origNode.clone().attrs({ target : '_blank', tabIndex : 3 });

            expect(clonedNode._attrs).to.eql({ href : '/', target : '_blank', tabIndex : 3 });
        });

        it('should replace children', () => {
            const origNode = node(C).children('link1'),
                clonedNode = origNode.clone().children('link2');

            expect(clonedNode._children).to.equal('link2');
        });
    });

    describe('function component node', () => {
        const C = () => {};

        it('should copy original fields', () => {
            const origNode = node(C).key('1').attrs({ href : '/' }).children('link').ctx({}),
                clonedNode = origNode.clone();

            expect(clonedNode.type).to.equal(origNode.type);
            expect(clonedNode._component).to.equal(origNode._component);
            expect(clonedNode._key).to.equal(origNode._key);
            expect(clonedNode._attrs).to.equal(origNode._attrs);
            expect(clonedNode._children).to.equal(origNode._children);
            expect(clonedNode._ctx).to.equal(origNode._ctx);
        });

        it('should merge attrs', () => {
            const origNode = node(C).attrs({ href : '/', tabIndex : 2 }),
                clonedNode = origNode.clone().attrs({ target : '_blank', tabIndex : 3 });

            expect(clonedNode._attrs).to.eql({ href : '/', target : '_blank', tabIndex : 3 });
        });

        it('should replace children', () => {
            const origNode = node(C).children('link1'),
                clonedNode = origNode.clone().children('link2');

            expect(clonedNode._children).to.equal('link2');
        });
    });

    describe('fragment node', () => {
        it('should copy original fields', () => {
            const origNode = node('fragment').key('1').children([node('a'), node('b')]).ctx({}),
                clonedNode = origNode.clone();

            expect(clonedNode.type).to.equal(origNode.type);
            expect(clonedNode._key).to.equal(origNode._key);
            expect(clonedNode._children).to.equal(origNode._children);
            expect(clonedNode._ctx).to.equal(origNode._ctx);
        });

        it('should replace children', () => {
            const origNode = node('fragment').children([node('a'), node('b')]),
                newChildren = [node('i')],
                clonedNode = origNode.clone().children(newChildren);

            expect(clonedNode._children).to.equal(newChildren);
        });
    });

    describe('text node', () => {
        it('should copy original fields', () => {
            const origNode = node('text').key('1').children('link'),
                clonedNode = origNode.clone();

            expect(clonedNode.type).to.equal(origNode.type);
            expect(clonedNode._key).to.equal(origNode._key);
            expect(clonedNode._children).to.equal(origNode._children);
        });

        it('should replace children', () => {
            const origNode = node('text').children('link1'),
                clonedNode = origNode.clone().children('link2');

            expect(clonedNode._children).to.equal('link2');
        });
    });
});
