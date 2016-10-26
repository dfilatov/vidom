import sinon from 'sinon';
import emptyObj from '../../../src/utils/emptyObj';
import { node, createComponent, mountSync, unmountSync } from '../../../src/vidom';

describe('onAttrsReceive', () => {
    let domNode;
    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should be called when new attrs is passed', () => {
        const spy = sinon.spy(),
            C = createComponent({
                onAttrsReceive : spy
            }),
            oldAttrs = { id : 1 },
            newAttrs = { id : 2 };

        mountSync(domNode, node(C).attrs(oldAttrs));
        mountSync(domNode, node(C).attrs(newAttrs));

        expect(spy.called).to.be.ok();
        expect(spy.calledWith(newAttrs, oldAttrs)).to.be.ok();
    });

    it('should be called when new children are passed', () => {
        const spy = sinon.spy(),
            C = createComponent({
                onAttrsReceive : spy
            }),
            oldChildren = [node('div')],
            newChildren = [node('span')];

        mountSync(domNode, node(C).children(oldChildren));
        mountSync(domNode, node(C).children(newChildren));

        expect(spy.called).to.be.ok();
        expect(spy.calledWith(emptyObj, emptyObj, newChildren, oldChildren)).to.be.ok();
    });

    it('shouldn\'t be called when no new attrs or children are passed', () => {
        const spy = sinon.spy(),
            C = createComponent({
                onAttrsReceive : spy
            });

        mountSync(domNode, node(C));
        mountSync(domNode, node(C));

        expect(spy.called).not.to.be.ok();
    });

    it('shouldn\'t add additional render if calls update()', done => {
        const spy = sinon.spy(),
            C = createComponent({
                onRender() {
                    spy.apply(this, arguments);
                    return node('div');
                },

                onAttrsReceive : function() {
                    this.update(() => {
                        expect(spy.calledTwice).to.be.ok();
                        done();
                    });
                }
            });

        mountSync(domNode, node(C));
        mountSync(domNode, node(C).attrs({}));
    });
});
