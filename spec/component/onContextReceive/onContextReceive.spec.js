import sinon from 'sinon';
import { createComponent, mountSync, unmountSync } from '../../../src/vidom';
import { h } from '../../helpers';

describe('onContextReceive', () => {
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
                onContextReceive(_prevContext) {
                    expect(this.context).to.be.equal(nextContext);
                    expect(_prevContext).to.be.equal(_prevContext);
                    done();
                }
            });

        mountSync(domNode, h(C), prevContext);
        mountSync(domNode, h(C), nextContext);
    });

    it('shouldn\'t be called if component updates itself', done => {
        const spy = sinon.spy(),
            C = createComponent({
                onContextReceive : spy,

                onMount() {
                    this.update();
                },

                onUpdate() {
                    expect(spy.called).not.to.be.ok();
                    done();
                }
            });

        mountSync(domNode, h(C));
    });

    it('shouldn\'t cause additional render if calls update()', done => {
        const spy = sinon.spy(),
            C = createComponent({
                onRender() {
                    spy();
                    return h('div');
                },

                onContextReceive() {
                    this.update();
                },

                onUpdate() {
                    expect(spy.calledTwice).to.be.ok();
                    done();
                }
            });

        mountSync(domNode, h(C), { ctx : 1 });
        mountSync(domNode, h(C), { ctx : 2 });
    });
});
