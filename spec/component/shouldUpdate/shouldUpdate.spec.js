import sinon from 'sinon';
import { node, createComponent, mountSync, unmountSync } from '../../../src/vidom';

describe('shouldUpdate', () => {
    let domNode;

    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should be called when new attrs and children are received', () => {
        const spy = sinon.spy(),
            C = createComponent({
                shouldUpdate() {
                    spy.apply(this, arguments);
                    return true;
                }
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

    it('should prevent rendering if returns false', () => {
        const spy = sinon.spy(),
            C = createComponent({
                onRender() {
                    spy();
                    return node('div');
                },

                shouldUpdate() {
                    return false;
                }
            });

        mountSync(domNode, node(C));
        mountSync(domNode, node(C));

        expect(spy.calledOnce).to.be.ok();
    });
});
