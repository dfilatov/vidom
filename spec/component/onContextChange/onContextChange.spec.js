import sinon from 'sinon';
import { node, createComponent, mountSync, unmountSync } from '../../../src/vidom';

describe('onContextChange', () => {
    let domNode;

    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should be called when new context is passed', done => {
        const prevContext = { ctx : 1 },
            nextContext = { ctx : 2 },
            C = createComponent({
                onContextChange(_prevContext) {
                    expect(this.context).to.be.equal(nextContext);
                    expect(_prevContext).to.be.equal(_prevContext);
                    done();
                }
            });

        mountSync(domNode, node(C), prevContext);
        mountSync(domNode, node(C), nextContext);
    });

    it('shouldn\'t be called when no new context is passed', () => {
        const spy = sinon.spy(),
            C = createComponent({
                onContextChange : spy
            });

        mountSync(domNode, node(C));
        mountSync(domNode, node(C));

        expect(spy.called).not.to.be.ok();
    });

    it('shouldn\'t cause additional render if calls update()', done => {
        const spy = sinon.spy(),
            C = createComponent({
                onRender() {
                    spy();
                    return node('div');
                },

                onContextChange() {
                    this.update(() => {
                        expect(spy.calledTwice).to.be.ok();
                        done();
                    });
                }
            });

        mountSync(domNode, node(C), { ctx : 1 });
        mountSync(domNode, node(C), { ctx : 2 });
    });
});
