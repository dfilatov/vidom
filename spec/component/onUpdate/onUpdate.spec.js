import sinon from 'sinon';
import createNode from '../../../src/createNode';
import createComponent from '../../../src/createComponent';
import { mountToDomSync, unmountFromDomSync } from '../../../src/client/mounter';

describe('onUpdate', () => {
    var domNode;
    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountFromDomSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should be called after a component is updated with actual and previous attributes', () => {
        const spy = sinon.spy(),
            C = createComponent({
                onRender(attrs) {
                    return createNode('div').attrs(attrs);
                },

                onUpdate : spy
            }),
            oldAttrs = { id : 1 },
            newAttrs = { id : 2 };

        mountToDomSync(domNode, createNode(C).attrs(oldAttrs));
        mountToDomSync(domNode, createNode(C).attrs(newAttrs));

        expect(spy.called).to.be.ok();
        expect(spy.calledWith(newAttrs, oldAttrs)).to.be.ok();
    });

    it.skip('should not be called if component isn\'t updated', () => {
        const spy = sinon.spy(),
            C = createComponent({
                onRender(attrs) {
                    return createNode('div').attrs(attrs);
                },

                onUpdate : spy
            }),
            oldAttrs = { id : 1 },
            newAttrs = { id : 1 };

        mountToDomSync(domNode, createNode(C).attrs(oldAttrs));
        mountToDomSync(domNode, createNode(C).attrs(newAttrs));

        expect(spy.called).not.to.be.ok();
    });
});
