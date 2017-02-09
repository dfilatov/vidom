import sinon from 'sinon';
import { node, createComponent, mountSync, unmountSync } from '../../../src/vidom';

describe('onAttrsChange', () => {
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
                onAttrsChange(_prevAttrs) {
                    expect(this.attrs).to.be.equal(newAttrs);
                    expect(_prevAttrs).to.be.equal(prevAttrs);
                    done();
                }
            });

        mountSync(domNode, node(C).setAttrs(prevAttrs));
        mountSync(domNode, node(C).setAttrs(newAttrs));
    });

    it('shouldn\'t be called when no new attrs are passed', () => {
        const spy = sinon.spy(),
            C = createComponent({
                onAttrsReceive : spy
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

                onAttrsChange() {
                    this.update(() => {
                        expect(spy.calledTwice).to.be.ok();
                        done();
                    });
                }
            });

        mountSync(domNode, node(C));
        mountSync(domNode, node(C).setAttrs({}));
    });
});
