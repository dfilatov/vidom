import { elem, createComponent } from '../../src/vidom';

describe('clone', () => {
    describe('tag element', () => {
        it('should copy original fields', () => {
            const origNode = elem('a')
                    .setKey('1')
                    .setAttrs({ href : '/' })
                    .setCtx({})
                    .setRef(() => {})
                    .setChildren('link'),
                clonedNode = origNode.clone();

            expect(clonedNode.type).to.equal(origNode.type);
            expect(clonedNode.tag).to.equal(origNode.tag);
            expect(clonedNode.key).to.equal(origNode.key);
            expect(clonedNode.attrs).to.equal(origNode.attrs);
            expect(clonedNode._ctx).to.equal(origNode._ctx);
            expect(clonedNode._ref).to.equal(origNode._ref);
            expect(clonedNode.children).to.equal(origNode.children);
        });

        it('should merge attrs', () => {
            const origNode = elem('a').setAttrs({ href : '/', tabIndex : 2 }),
                clonedNode = origNode.clone().setAttrs({ target : '_blank', tabIndex : 3 });

            expect(clonedNode.attrs).to.eql({ href : '/', target : '_blank', tabIndex : 3 });
        });

        it('should replace children', () => {
            const origNode = elem('a').setChildren('link1'),
                clonedNode = origNode.clone().setChildren('link2');

            expect(clonedNode.children).to.equal('link2');
        });
    });

    describe('component element', () => {
        const C = createComponent({});

        it('should copy original fields', () => {
            const origNode = elem(C)
                    .setKey('1')
                    .setAttrs({ href : '/' })
                    .setCtx({})
                    .setRef(() => {})
                    .setChildren('link'),
                clonedNode = origNode.clone();

            expect(clonedNode.type).to.equal(origNode.type);
            expect(clonedNode._component).to.equal(origNode._component);
            expect(clonedNode.key).to.equal(origNode.key);
            expect(clonedNode.attrs).to.equal(origNode.attrs);
            expect(clonedNode._ctx).to.equal(origNode._ctx);
            expect(clonedNode._ref).to.equal(origNode._ref);
            expect(clonedNode.children).to.equal(origNode.children);
        });

        it('should merge attrs', () => {
            const origNode = elem(C).setAttrs({ href : '/', tabIndex : 2 }),
                clonedNode = origNode.clone().setAttrs({ target : '_blank', tabIndex : 3 });

            expect(clonedNode.attrs).to.eql({ href : '/', target : '_blank', tabIndex : 3 });
        });

        it('should replace children', () => {
            const origNode = elem(C).setChildren('link1'),
                clonedNode = origNode.clone().setChildren('link2');

            expect(clonedNode.children).to.equal('link2');
        });
    });

    describe('function component element', () => {
        const C = () => {};

        it('should copy original fields', () => {
            const origNode = elem(C).setKey('1').setAttrs({ href : '/' }).setChildren('link').setCtx({}),
                clonedNode = origNode.clone();

            expect(clonedNode.type).to.equal(origNode.type);
            expect(clonedNode._component).to.equal(origNode._component);
            expect(clonedNode.key).to.equal(origNode.key);
            expect(clonedNode.attrs).to.equal(origNode.attrs);
            expect(clonedNode.children).to.equal(origNode.children);
            expect(clonedNode._ctx).to.equal(origNode._ctx);
        });

        it('should merge attrs', () => {
            const origNode = elem(C).setAttrs({ href : '/', tabIndex : 2 }),
                clonedNode = origNode.clone().setAttrs({ target : '_blank', tabIndex : 3 });

            expect(clonedNode.attrs).to.eql({ href : '/', target : '_blank', tabIndex : 3 });
        });

        it('should replace children', () => {
            const origNode = elem(C).setChildren('link1'),
                clonedNode = origNode.clone().setChildren('link2');

            expect(clonedNode.children).to.equal('link2');
        });
    });

    describe('fragment element', () => {
        it('should copy original fields', () => {
            const origNode = elem('fragment').setKey('1').setChildren([elem('a'), elem('b')]).setCtx({}),
                clonedNode = origNode.clone();

            expect(clonedNode.type).to.equal(origNode.type);
            expect(clonedNode.key).to.equal(origNode.key);
            expect(clonedNode.children).to.equal(origNode.children);
            expect(clonedNode._ctx).to.equal(origNode._ctx);
        });

        it('should replace children', () => {
            const origNode = elem('fragment').setChildren([elem('a'), elem('b')]),
                newChildren = [elem('i')],
                clonedNode = origNode.clone().setChildren(newChildren);

            expect(clonedNode.children).to.equal(newChildren);
        });
    });

    describe('text element', () => {
        it('should copy original fields', () => {
            const origNode = elem('plaintext').setKey('1').setChildren('link'),
                clonedNode = origNode.clone();

            expect(clonedNode.type).to.equal(origNode.type);
            expect(clonedNode.key).to.equal(origNode.key);
            expect(clonedNode.children).to.equal(origNode.children);
        });

        it('should replace children', () => {
            const origNode = elem('plaintext').setChildren('link1'),
                clonedNode = origNode.clone().setChildren('link2');

            expect(clonedNode.children).to.equal('link2');
        });
    });
});
