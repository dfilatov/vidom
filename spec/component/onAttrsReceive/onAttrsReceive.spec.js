import sinon from 'sinon';
import { createComponent, mountSync, unmountSync } from '../../../src/vidom';
import { h } from '../../helpers';

describe('onAttrsReceive', () => {
    let domNode;

    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should be called when new attrs are passed', done => {
        const prevAttrs = { id : 1 },
            nextAttrs = { id : 2 },
            C = createComponent({
                onAttrsReceive(receivedAttrs) {
                    expect(receivedAttrs).to.be.equal(nextAttrs);
                    expect(this.attrs).to.be.equal(prevAttrs);
                    done();
                }
            });

        mountSync(domNode, h(C, prevAttrs));
        mountSync(domNode, h(C, nextAttrs));
    });

    it('shouldn\'t be called if component updates itself', done => {
        const spy = sinon.spy(),
            C = createComponent({
                onAttrsReceive : spy,

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

                onAttrsReceive() {
                    this.update();
                },

                onMount() {
                    this.update();
                },

                onUpdate() {
                    expect(spy.calledTwice).to.be.ok();
                    done();
                }
            });

        mountSync(domNode, h(C));
        mountSync(domNode, h(C, {}));
    });
});
