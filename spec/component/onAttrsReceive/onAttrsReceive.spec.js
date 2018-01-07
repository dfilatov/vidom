import sinon from 'sinon';
import { elem, createComponent, mountSync, unmountSync } from '../../../src/vidom';

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
            newAttrs = { id : 2 },
            C = createComponent({
                onAttrsReceive(_prevAttrs) {
                    expect(this.attrs).to.be.equal(newAttrs);
                    expect(_prevAttrs).to.be.equal(prevAttrs);
                    done();
                }
            });

        mountSync(domNode, elem(C).setAttrs(prevAttrs));
        mountSync(domNode, elem(C).setAttrs(newAttrs));
    });

    it('shouldn\'t be called if component updates itself', done => {
        const spy = sinon.spy(),
            C = createComponent({
                onAttrsReceive : spy,
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

                onAttrsReceive() {
                    this.update(() => {
                        expect(spy.calledTwice).to.be.ok();
                        done();
                    });
                }
            });

        mountSync(domNode, elem(C));
        mountSync(domNode, elem(C).setAttrs({}));
    });
});
