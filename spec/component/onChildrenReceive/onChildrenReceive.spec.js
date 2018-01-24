import sinon from 'sinon';
import { createComponent, mountSync, unmountSync } from '../../../src/vidom';
import { h } from '../../helpers';

describe('onChildrenReceive', () => {
    let domNode;

    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should be called when new children are passed', done => {
        const prevChildren = [h('div')],
            nextChildren = [h('span')],
            C = createComponent({
                onChildrenReceive(_prevChildren) {
                    expect(this.children).to.be.equal(nextChildren);
                    expect(_prevChildren).to.be.equal(prevChildren);
                    done();
                }
            });

        mountSync(domNode, h(C, { children : prevChildren }));
        mountSync(domNode, h(C, { children : nextChildren }));
    });

    it('shouldn\'t be called if component updates itself', done => {
        const spy = sinon.spy(),
            C = createComponent({
                onChildrenReceive : spy,

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

                onChildrenReceive() {
                    this.update();
                },

                onUpdate() {
                    expect(spy.calledTwice).to.be.ok();
                    done();
                }
            });

        mountSync(domNode, h(C));
        mountSync(domNode, h(C, { children : [] }));
    });
});
