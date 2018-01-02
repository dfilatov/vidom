import sinon from 'sinon';
import { elem, createComponent, mountSync, unmountSync } from '../../src/vidom';

describe('ref', () => {
    let domNode;

    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        document.body.removeChild(domNode);
    });

    describe('for tag nodes', () => {
        it('should call callback with dom node on tag node mount', () => {
            const spy = sinon.spy();

            mountSync(domNode, elem('div').setAttrs({ id : 'id1' }).setRef(spy));

            expect(spy.calledOnce).to.be.ok();
            expect(spy.args[0][0]).to.be.equal(document.getElementById('id1'));

            unmountSync(domNode);
        });

        it('should call callback with null on tag node unmount', () => {
            const spy = sinon.spy();

            mountSync(domNode, elem('div').setRef(spy));
            unmountSync(domNode);

            expect(spy.calledTwice).to.be.ok();
            expect(spy.args[1][0]).to.be.equal(null);
        });

        it('should call callback with null during patching without reference', () => {
            const spy = sinon.spy();

            mountSync(domNode, elem('div').setRef(spy));
            mountSync(domNode, elem('div'));

            expect(spy.calledTwice).to.be.ok();
            expect(spy.args[1][0]).to.be.equal(null);

            unmountSync(domNode);
        });

        it('should call callbacks during patching with a new reference', () => {
            const spy1 = sinon.spy(),
                spy2 = sinon.spy();

            mountSync(domNode, elem('div').setAttrs({ id : 'id1' }).setRef(spy1));
            mountSync(domNode, elem('div').setAttrs({ id : 'id1' }).setRef(spy2));

            expect(spy1.calledTwice).to.be.ok();
            expect(spy1.args[1][0]).to.be.equal(null);
            expect(spy2.calledOnce).to.be.ok();
            expect(spy2.args[0][0]).to.be.equal(document.getElementById('id1'));

            unmountSync(domNode);
        });

        it('shouldn\'t call callback during patching with the same reference', () => {
            const spy = sinon.spy();

            mountSync(domNode, elem('div').setRef(spy));
            mountSync(domNode, elem('div').setRef(spy));

            expect(spy.calledOnce).to.be.ok();

            unmountSync(domNode);
        });
    });

    describe('for component nodes', () => {
        const C = createComponent({});

        it('should call callback with component instance on component node mount', () => {
            const spy = sinon.spy();

            mountSync(domNode, elem(C).setRef(spy));

            expect(spy.calledOnce).to.be.ok();
            expect(spy.args[0][0]).to.be.a(C);

            unmountSync(domNode);
        });

        it('should call callback with null on component node unmount', () => {
            const spy = sinon.spy();

            mountSync(domNode, elem(C).setRef(spy));
            unmountSync(domNode);

            expect(spy.calledTwice).to.be.ok();
            expect(spy.args[1][0]).to.be.equal(null);
        });

        it('should call callback with null during patching without reference', () => {
            const spy = sinon.spy();

            mountSync(domNode, elem(C).setRef(spy));
            mountSync(domNode, elem(C));

            expect(spy.calledTwice).to.be.ok();
            expect(spy.args[1][0]).to.be.equal(null);

            unmountSync(domNode);
        });

        it('should call callbacks during patching with a new reference', () => {
            const spy1 = sinon.spy(),
                spy2 = sinon.spy();

            mountSync(domNode, elem(C).setRef(spy1));
            mountSync(domNode, elem(C).setRef(spy2));

            expect(spy1.calledTwice).to.be.ok();
            expect(spy1.args[1][0]).to.be.equal(null);
            expect(spy2.calledOnce).to.be.ok();
            expect(spy2.args[0][0]).to.be.a(C);

            unmountSync(domNode);
        });

        it('shouldn\'t call callback during patching with the same reference', () => {
            const spy = sinon.spy();

            mountSync(domNode, elem(C).setRef(spy));
            mountSync(domNode, elem(C).setRef(spy));

            expect(spy.calledOnce).to.be.ok();

            unmountSync(domNode);
        });
    });
});
