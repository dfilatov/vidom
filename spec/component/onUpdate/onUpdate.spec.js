import sinon from 'sinon';
import { node, createComponent, mountToDomSync, unmountFromDomSync } from '../../../src/vidom';

describe('onUpdate', () => {
    var domNode;
    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountFromDomSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should be called after a component has updated with actual and previous attributes and children', () => {
        const spy = sinon.spy(),
            C = createComponent({
                onUpdate : spy
            }),
            oldAttrs = { id : 1 },
            newAttrs = { id : 2 },
            oldChildren = [node('div')],
            newChildren = [node('span')];

        mountToDomSync(domNode, node(C).attrs(oldAttrs).children(oldChildren));
        mountToDomSync(domNode, node(C).attrs(newAttrs).children(newChildren));

        expect(spy.called).to.be.ok();
        expect(spy.calledWith(newAttrs, oldAttrs, newChildren, oldChildren)).to.be.ok();
    });

    it('should not be called if component hasn\'t updated', () => {
        const spy = sinon.spy(),
            C = createComponent({
                shouldUpdate() {
                    return false;
                },

                onUpdate : spy
            });

        mountToDomSync(domNode, node(C).attrs({ id : 1 }));
        mountToDomSync(domNode, node(C).attrs({ id : 2 }));

        expect(spy.called).not.to.be.ok();
    });
});
