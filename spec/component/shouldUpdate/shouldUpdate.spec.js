import sinon from 'sinon';
import { node, createComponent, mountToDomSync, unmountFromDomSync } from '../../../src/vidom';

describe('shouldUpdate', () => {
    let domNode;

    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountFromDomSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should be called when new attrs is passed', () => {
        const spy = sinon.spy(),
            C = createComponent({
                onRender() {
                    return node('div');
                },

                shouldUpdate() {
                    spy.apply(this, arguments);
                    return true;
                }
            }),
            oldAttrs = { id : 1 },
            newAttrs = { id : 2 };

        mountToDomSync(domNode, node(C).attrs(oldAttrs));
        mountToDomSync(domNode, node(C).attrs(newAttrs));

        expect(spy.called).to.be.ok();
        expect(spy.calledWith(newAttrs, oldAttrs)).to.be.ok();
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

        mountToDomSync(domNode, node(C));
        mountToDomSync(domNode, node(C));

        expect(spy.calledOnce).to.be.ok();
    });
});
