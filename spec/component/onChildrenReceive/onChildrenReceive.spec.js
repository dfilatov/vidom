import sinon from 'sinon';
import { elem, createComponent, mountSync, unmountSync } from '../../../src/vidom';

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
        const prevChildren = [elem('div')],
            nextChildren = [elem('span')],
            C = createComponent({
                onChildrenReceive(_prevChildren) {
                    expect(this.children).to.be.equal(nextChildren);
                    expect(_prevChildren).to.be.equal(prevChildren);
                    done();
                }
            });

        mountSync(domNode, elem(C).setChildren(prevChildren));
        mountSync(domNode, elem(C).setChildren(nextChildren));
    });

    it('shouldn\'t be called if component updates itself', done => {
        const spy = sinon.spy(),
            C = createComponent({
                onChildrenReceive : spy,
                onMount() {
                    this.update(() => {
                        expect(spy.called).not.to.be.ok();
                        done();
                    });
                }
            });

        mountSync(domNode, elem(C));
    });

    it('shouldn\'t cause additional render if calls update()', done => {
        const spy = sinon.spy(),
            C = createComponent({
                onRender() {
                    spy();
                    return elem('div');
                },

                onChildrenReceive() {
                    this.update(() => {
                        expect(spy.calledTwice).to.be.ok();
                        done();
                    });
                }
            });

        mountSync(domNode, elem(C));
        mountSync(domNode, elem(C).setChildren([]));
    });
});
