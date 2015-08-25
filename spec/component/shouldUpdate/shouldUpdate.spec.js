import sinon from 'sinon';
import createNode from '../../../src/createNode';
import createComponent from '../../../src/createComponent';
import { mountToDomSync, unmountFromDomSync } from '../../../src/client/mounter';

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
                    return createNode('div');
                },

                shouldUpdate : spy
            }),
            oldAttrs = { id : 1 },
            newAttrs = { id : 2 };

        mountToDomSync(domNode, createNode(C).attrs(oldAttrs));
        mountToDomSync(domNode, createNode(C).attrs(newAttrs));

        expect(spy.called).to.be.ok();
        expect(spy.calledWith(newAttrs, oldAttrs)).to.be.ok();
    });

    it('shouldn prevent rendering if returns false', () => {
        const spy = sinon.spy(),
            C = createComponent({
                onRender() {
                    spy.apply(this, arguments);
                    return createNode('div');
                },

                shouldUpdate() {
                    return false;
                }
            });

        mountToDomSync(domNode, createNode(C));
        mountToDomSync(domNode, createNode(C));

        expect(spy.calledOnce).to.be.ok();
    });
});
