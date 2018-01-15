import { createComponent } from '../../src/vidom';
import { h } from '../helpers';

describe('clone', () => {
    describe('tag element', () => {
        it('should copy original fields', () => {
            const origNode = h('a', {
                    key : '1',
                    href : '/',
                    ref : () => {},
                    children : 'link'
                }).setCtx({}),
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
            const origNode = h('a', { href : '/', tabIndex : 2 }),
                clonedNode = origNode.clone({ target : '_blank', tabIndex : 3 });

            expect(clonedNode.attrs).to.eql({ href : '/', target : '_blank', tabIndex : 3 });
        });

        it('should replace children', () => {
            const origNode = h('a', { children : 'link1' }),
                clonedNode = origNode.clone({}, 'link2');

            expect(clonedNode.children).to.equal('link2');
        });
    });

    describe('component element', () => {
        const C = createComponent({});

        it('should copy original fields', () => {
            const origNode = h(C, {
                    key : '1',
                    href : '/',
                    ref : () => {},
                    children : 'link'
                }).setCtx({}),
                clonedNode = origNode.clone();

            expect(clonedNode.type).to.equal(origNode.type);
            expect(clonedNode.component).to.equal(origNode.component);
            expect(clonedNode.key).to.equal(origNode.key);
            expect(clonedNode.attrs).to.equal(origNode.attrs);
            expect(clonedNode._ctx).to.equal(origNode._ctx);
            expect(clonedNode._ref).to.equal(origNode._ref);
            expect(clonedNode.children).to.equal(origNode.children);
        });

        it('should merge attrs', () => {
            const origNode = h(C, { href : '/', tabIndex : 2 }),
                clonedNode = origNode.clone({ target : '_blank', tabIndex : 3 });

            expect(clonedNode.attrs).to.eql({ href : '/', target : '_blank', tabIndex : 3 });
        });

        it('should replace children', () => {
            const origNode = h(C, { children : 'link1' }),
                clonedNode = origNode.clone({}, 'link2');

            expect(clonedNode.children).to.equal('link2');
        });
    });

    describe('function component element', () => {
        const C = () => {};

        it('should copy original fields', () => {
            const origNode = h(C, {
                    key : '1',
                    href : '/',
                    children : 'link'
                }).setCtx({}),
                clonedNode = origNode.clone();

            expect(clonedNode.type).to.equal(origNode.type);
            expect(clonedNode.component).to.equal(origNode.component);
            expect(clonedNode.key).to.equal(origNode.key);
            expect(clonedNode.attrs).to.equal(origNode.attrs);
            expect(clonedNode.children).to.equal(origNode.children);
            expect(clonedNode._ctx).to.equal(origNode._ctx);
        });

        it('should merge attrs', () => {
            const origNode = h(C, { href : '/', tabIndex : 2 }),
                clonedNode = origNode.clone({ target : '_blank', tabIndex : 3 });

            expect(clonedNode.attrs).to.eql({ href : '/', target : '_blank', tabIndex : 3 });
        });

        it('should replace children', () => {
            const origNode = h(C, { children : 'link1' }),
                clonedNode = origNode.clone({}, 'link2');

            expect(clonedNode.children).to.equal('link2');
        });
    });

    describe('fragment element', () => {
        it('should copy original fields', () => {
            const origNode = h('fragment', {
                    key : '1',
                    children : [h('a'), h('b')]
                }).setCtx({}),
                clonedNode = origNode.clone();

            expect(clonedNode.type).to.equal(origNode.type);
            expect(clonedNode.key).to.equal(origNode.key);
            expect(clonedNode.children).to.equal(origNode.children);
            expect(clonedNode._ctx).to.equal(origNode._ctx);
        });

        it('should replace children', () => {
            const origNode = h('fragment', { children : [h('a'), h('b')] }),
                newChildren = [h('i')],
                clonedNode = origNode.clone(newChildren);

            expect(clonedNode.children).to.equal(newChildren);
        });
    });

    describe('text element', () => {
        it('should copy original fields', () => {
            const origNode = h('plaintext', { key : '1', children : 'link' }),
                clonedNode = origNode.clone();

            expect(clonedNode.type).to.equal(origNode.type);
            expect(clonedNode.key).to.equal(origNode.key);
            expect(clonedNode.children).to.equal(origNode.children);
        });

        it('should replace children', () => {
            const origNode = h('plaintext', { children : 'link1' }),
                clonedNode = origNode.clone('link2');

            expect(clonedNode.children).to.equal('link2');
        });
    });
});
