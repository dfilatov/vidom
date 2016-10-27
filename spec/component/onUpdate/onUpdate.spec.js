import sinon from 'sinon';
import { node, createComponent, mountSync, unmountSync } from '../../../src/vidom';

describe('onUpdate', () => {
    var domNode;
    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountSync(domNode);
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

        mountSync(domNode, node(C).attrs(oldAttrs).children(oldChildren));
        mountSync(domNode, node(C).attrs(newAttrs).children(newChildren));

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

        mountSync(domNode, node(C).attrs({ id : 1 }));
        mountSync(domNode, node(C).attrs({ id : 2 }));

        expect(spy.called).not.to.be.ok();
    });
});
