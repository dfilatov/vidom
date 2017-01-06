import sinon from 'sinon';
import { node, createComponent, mountSync, unmountSync } from '../../src/vidom';

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

            mountSync(domNode, node('div').attrs({ id : 'id1' }).ref(spy));

            expect(spy.calledOnce).to.be.ok();
            expect(spy.args[0][0]).to.be.equal(document.getElementById('id1'));

            unmountSync(domNode);
        });

        it('should call callback with null on tag node unmount', () => {
            const spy = sinon.spy();

            mountSync(domNode, node('div').ref(spy));
            unmountSync(domNode);

            expect(spy.calledTwice).to.be.ok();
            expect(spy.args[1][0]).to.be.equal(null);
        });
    });

    describe('for component nodes', () => {
        const C = createComponent({});

        it('should call callback with component instance on component node mount', () => {
            const spy = sinon.spy();

            mountSync(domNode, node(C).ref(spy));

            expect(spy.calledOnce).to.be.ok();
            expect(spy.args[0][0]).to.be.a(C);

            unmountSync(domNode);
        });

        it('should call callback with null on component node unmount', () => {
            const spy = sinon.spy();

            mountSync(domNode, node(C).ref(spy));
            unmountSync(domNode);

            expect(spy.calledTwice).to.be.ok();
            expect(spy.args[1][0]).to.be.equal(null);
        });
    });
});
